# Sahayak AI — Production Backend & Hardware Integration

Sahayak AI is a voice-first, multilingual RAG-based rural assistance platform for farmers and cooperative members in India.

---

## 🏗️ System Architecture

```
 ┌─────────────────────┐
 │   EXISTING FRONTEND │
 │ Web / Kiosk UI      │
 └──────────┬──────────┘
            │ REST / WebSockets
            ▼
 ┌─────────────────────┐
 │   FASTAPI BACKEND   │
 └──────────┬──────────┘
            │
  ┌─────────┼─────────┬──────────────┐
  ▼         ▼         ▼              ▼
 ┌───┐   ┌─────┐   ┌─────┐   ┌──────────────┐
 │STT│   │ RAG │   │ TTS │   │XIAO ESP32-C3 │
 └───┘   └─────┘   └─────┘   └──────────────┘
```

---

## 🚀 Fast Start Instructions

### 1. Start Database & Backend Services
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Ingest Official Knowledge Base Documents
```bash
python scripts/ingest_documents.py
```

### 3. Flash ESP32-C3 Firmware
- Open `firmware/sahayak_esp32c3.ino` in Arduino IDE or PlatformIO.
- Select Board: **Seeed XIAO ESP32C3**.
- Set WiFi SSID & Password variables.
- Upload to device.

---

## 📌 Hardware Pin Mapping (XIAO ESP32-C3)

| Component | Signal | GPIO Pin |
|---|---|---|
| **128x64 OLED (I2C SSD1306)** | SDA | `GPIO 6` |
| | SCL | `GPIO 7` |
| **MAX98357A Speaker (I2S DAC)** | BCLK | `GPIO 4` |
| | LRC / WS | `GPIO 5` |
| | DIN | `GPIO 3` |
| **I2S Microphone** | SCK / BCLK | `GPIO 20` |
| | WS / LRCLK | `GPIO 10` |
| | SD | `GPIO 2` |
| **Push-To-Talk Button** | BTN | `GPIO 9` |

---

## 📡 API Endpoints Summary

- `GET /health` — System status & loaded models
- `POST /api/chat` — Text chat RAG query
- `POST /api/voice` — End-to-end voice query (Audio in -> STT -> RAG -> LLM -> TTS -> Audio out)
- `GET /api/schemes` — Official government schemes list
- `POST /api/grievance/analyze` — Grievance resolution procedure
- `GET /api/devices` — Live ESP32 hardware telemetry status
- `WS /ws/esp32` — Real-time ESP32 hardware audio stream & OLED protocol
