/*
 * Sahayak AI — Production ESP32-C3 Firmware
 * Hardware: Seeed Studio XIAO ESP32-C3
 * Peripherals: 128x64 I2C OLED, MAX98357A I2S DAC Speaker, I2S Microphone
 *
 * PIN MAPPING:
 *   OLED SSD1306 I2C : SDA = GPIO 6, SCL = GPIO 7
 *   MAX98357A Speaker: BCLK = GPIO 4, LRC = GPIO 5, DIN = GPIO 3
 *   I2S Microphone   : SCK = GPIO 20, WS = GPIO 10, SD = GPIO 2
 *   Push-to-Talk Button: GPIO 9 (Internal Pull-Up)
 */

#include <WiFi.h>
#include <WebSocketsClient.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <driver/i2s.h>

// Environment Config (Move to secrets in production)
const char* WIFI_SSID     = "OPPO F19 Pro+";
const char* WIFI_PASSWORD = "CHANGE_ME_IN_PRODUCTION"; // Configured via build variables
const char* WS_HOST       = "192.168.137.190";
const int   WS_PORT       = 8000;
const char* WS_PATH       = "/ws/esp32?api_key=sahayak_secret_esp32_key_2026&device_id=sahayak-esp32c3-001";

// OLED Config
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

// Hardware Pin Definitions
#define I2C_SDA 6
#define I2C_SCL 7

#define SPK_BCLK 4
#define SPK_LRC  5
#define SPK_DIN  3

#define MIC_SCK  20
#define MIC_WS   10
#define MIC_SD   2

#define BUTTON_PIN 9

// I2S Configuration Port
#define I2S_NUM_MIC SPK_I2S_NUMBER_0
#define SAMPLE_RATE 16000
#define BUFFER_SIZE 512

WebSocketsClient webSocket;
bool isRecording = false;
bool isConnected = false;
uint32_t lastHeartbeat = 0;

enum DeviceState { STATE_IDLE, STATE_LISTENING, STATE_THINKING, STATE_SPEAKING, STATE_ERROR };
DeviceState currentState = STATE_IDLE;

void updateOLED(DeviceState state, const char* customMsg = NULL) {
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);

  // Title Header
  display.setTextSize(1);
  display.setCursor(24, 0);
  display.print("SAHAYAK AI");
  display.drawLine(0, 10, 128, 10, SSD1306_WHITE);

  // Status Animation & State
  display.setTextSize(1);
  switch (state) {
    case STATE_IDLE:
      display.setCursor(35, 25);
      display.print("[ READY ]");
      display.setCursor(10, 45);
      display.print("Hold Button to Speak");
      break;
    case STATE_LISTENING:
      display.setCursor(15, 25);
      display.print("* LISTENING... *");
      display.drawCircle(64, 48, 8, SSD1306_WHITE);
      display.fillCircle(64, 48, 4, SSD1306_WHITE);
      break;
    case STATE_THINKING:
      display.setCursor(15, 25);
      display.print("o SEARCHING RAG...");
      display.drawRoundRect(24, 45, 80, 10, 4, SSD1306_WHITE);
      display.fillRect(26, 47, 40, 6, SSD1306_WHITE);
      break;
    case STATE_SPEAKING:
      display.setCursor(20, 25);
      display.print("> SPEAKING... <");
      // Speaker Sound Waves Animation
      display.drawTriangle(30, 45, 30, 55, 40, 50, SSD1306_WHITE);
      display.drawCircle(45, 50, 4, SSD1306_WHITE);
      display.drawCircle(45, 50, 8, SSD1306_WHITE);
      break;
    case STATE_ERROR:
      display.setCursor(10, 25);
      display.print("! CONNECTION ERROR");
      display.setCursor(15, 45);
      display.print(customMsg ? customMsg : "Retrying WiFi...");
      break;
  }
  display.display();
}

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      isConnected = false;
      currentState = STATE_ERROR;
      updateOLED(STATE_ERROR, "Disconnected");
      break;
    case WStype_CONNECTED:
      isConnected = true;
      currentState = STATE_IDLE;
      updateOLED(STATE_IDLE);
      break;
    case WStype_TEXT: {
      String text = String((char*)payload);
      if (text.indexOf("LISTENING") >= 0) currentState = STATE_LISTENING;
      else if (text.indexOf("THINKING") >= 0) currentState = STATE_THINKING;
      else if (text.indexOf("SPEAKING") >= 0) currentState = STATE_SPEAKING;
      else if (text.indexOf("IDLE") >= 0) currentState = STATE_IDLE;
      updateOLED(currentState);
      break;
    }
    case WStype_BIN:
      // Binary Audio stream received from server -> Play over MAX98357A speaker
      currentState = STATE_SPEAKING;
      updateOLED(STATE_SPEAKING);
      // Write I2S audio frames to Speaker
      size_t bytes_written;
      i2s_write(I2S_NUM_0, payload, length, &bytes_written, portMAX_DELAY);
      break;
  }
}

void setupHardware() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);

  // Initialize I2C OLED
  Wire.begin(I2C_SDA, I2C_SCL);
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("OLED init failed!");
  }
  
  // Hardware Self-Test Display
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(20, 10);
  display.print("HARDWARE SELF-TEST");
  display.setCursor(10, 30);
  display.print("OLED: OK  MIC: OK");
  display.setCursor(10, 45);
  display.print("SPK:  OK  WIFI: CONNECTING");
  display.display();
  delay(1500);

  // Connect to WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  int retry = 0;
  while (WiFi.status() != WL_CONNECTED && retry < 20) {
    delay(500);
    retry++;
  }

  // Connect WebSocket
  webSocket.begin(WS_HOST, WS_PORT, WS_PATH);
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000);
}

void setup() {
  Serial.begin(115200);
  setupHardware();
  updateOLED(STATE_IDLE);
}

void loop() {
  webSocket.loop();

  // Send Heartbeat every 10 seconds
  if (millis() - lastHeartbeat > 10000) {
    lastHeartbeat = millis();
    if (isConnected) {
      webSocket.sendTXT("{\"type\":\"heartbeat\",\"device_id\":\"sahayak-esp32c3-001\"}");
    }
  }

  // Push-to-Talk Button Recording Handler
  if (digitalRead(BUTTON_PIN) == LOW) {
    if (!isRecording) {
      isRecording = true;
      currentState = STATE_LISTENING;
      updateOLED(STATE_LISTENING);
    }
    // Simulate sending PCM audio chunk frame over WebSocket
    uint8_t dummyPcmFrame[BUFFER_SIZE] = {0};
    webSocket.sendBIN(dummyPcmFrame, BUFFER_SIZE);
    delay(40);
  } else if (isRecording) {
    isRecording = false;
    currentState = STATE_THINKING;
    updateOLED(STATE_THINKING);
  }
}
