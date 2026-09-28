import logging
from typing import Dict, List, Any
from fastapi import WebSocket
from app.hardware.protocol import DeviceState

logger = logging.getLogger("sahayak.hardware.ws")

class WebSocketManager:
    def __init__(self):
        # Frontend web client connections
        self.active_clients: List[WebSocket] = []
        # ESP32 hardware device connections map: { device_id: { "ws": WebSocket, "status": Dict, "state": str } }
        self.esp32_devices: Dict[str, Dict[str, Any]] = {}

    async def connect_client(self, websocket: WebSocket):
        await websocket.accept()
        self.active_clients.append(websocket)
        logger.info(f"Frontend client connected. Total clients: {len(self.active_clients)}")

    def disconnect_client(self, websocket: WebSocket):
        if websocket in self.active_clients:
            self.active_clients.remove(websocket)
            logger.info("Frontend client disconnected.")

    async def connect_esp32(self, device_id: str, websocket: WebSocket):
        await websocket.accept()
        self.esp32_devices[device_id] = {
            "ws": websocket,
            "status": {"wifi": True, "rssi": -52, "mic": True, "speaker": True, "oled": True},
            "state": DeviceState.IDLE,
            "last_seen": "Just now"
        }
        logger.info(f"ESP32 hardware device '{device_id}' connected.")
        # Broadcast device online status to frontend clients
        await self.broadcast_to_clients({
            "type": "device_status_update",
            "device_id": device_id,
            "status": "ONLINE",
            "state": DeviceState.IDLE
        })

    def disconnect_esp32(self, device_id: str):
        if device_id in self.esp32_devices:
            del self.esp32_devices[device_id]
            logger.info(f"ESP32 hardware device '{device_id}' disconnected.")

    async def send_esp32_state(self, device_id: str, state: DeviceState):
        if device_id in self.esp32_devices:
            self.esp32_devices[device_id]["state"] = state
            ws = self.esp32_devices[device_id]["ws"]
            try:
                await ws.send_json({"type": "state", "state": state.value})
            except Exception as e:
                logger.error(f"Error sending state to ESP32 ({e})")

        # Also notify frontend clients of the state change
        await self.broadcast_to_clients({
            "type": "device_state_change",
            "device_id": device_id,
            "state": state.value
        })

    async def broadcast_to_clients(self, message: dict):
        for client in self.active_clients:
            try:
                await client.send_json(message)
            except Exception as e:
                logger.error(f"Error broadcasting to frontend client: {e}")

ws_manager = WebSocketManager()
