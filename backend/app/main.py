import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import setup_logging
from app.hardware.websocket_manager import ws_manager
from app.hardware.esp32_manager import esp32_manager
from app.api import health, chat, voice, schemes, grievances, documents, devices

setup_logging()
logger = logging.getLogger("sahayak.main")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Multilingual Cooperative Governance & Legal Assistance Chatbot Backend with RAG and ESP32 Hardware Integration"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(health.router, tags=["Health"])
app.include_router(chat.router, prefix=settings.API_V1_STR, tags=["Chat"])
app.include_router(voice.router, prefix=settings.API_V1_STR, tags=["Voice"])
app.include_router(schemes.router, prefix=settings.API_V1_STR, tags=["Schemes"])
app.include_router(grievances.router, prefix=settings.API_V1_STR, tags=["Grievance"])
app.include_router(documents.router, prefix=settings.API_V1_STR, tags=["Knowledge Base Documents"])
app.include_router(devices.router, prefix=settings.API_V1_STR, tags=["ESP32 Devices"])

# Web Frontend WebSocket
@app.websocket("/ws/client")
async def websocket_client_endpoint(websocket: WebSocket):
    await ws_manager.connect_client(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            logger.info(f"Received frontend message: {data}")
    except WebSocketDisconnect:
        ws_manager.disconnect_client(websocket)
    except Exception as e:
        logger.error(f"Frontend WebSocket error: {e}")
        ws_manager.disconnect_client(websocket)

# ESP32 Hardware WebSocket
@app.websocket("/ws/esp32")
async def websocket_esp32_endpoint(
    websocket: WebSocket,
    api_key: str = Query(..., alias="api_key"),
    device_id: str = Query("sahayak-esp32c3-001", alias="device_id")
):
    # Verify API key authentication
    if api_key != settings.ESP32_API_KEY:
        logger.warning(f"Unauthorized ESP32 connection attempt with API key: '{api_key}'")
        await websocket.close(code=4001, reason="Unauthorized API Key")
        return

    await ws_manager.connect_esp32(device_id, websocket)
    try:
        while True:
            # Handle text messages or raw binary PCM audio frames from ESP32 mic
            message = await websocket.receive()
            if "bytes" in message and message["bytes"]:
                audio_bytes = message["bytes"]
                await esp32_manager.process_audio_frame(device_id, audio_bytes)
            elif "text" in message and message["text"]:
                logger.info(f"ESP32 text message from '{device_id}': {message['text']}")
    except WebSocketDisconnect:
        ws_manager.disconnect_esp32(device_id)
    except Exception as e:
        logger.error(f"ESP32 WebSocket error ({e})")
        ws_manager.disconnect_esp32(device_id)
