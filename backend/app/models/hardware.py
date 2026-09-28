from pydantic import BaseModel
from typing import Optional

class DeviceRegisterMessage(BaseModel):
    type: str = "device_register"
    device_id: str
    device_type: str = "xiao-esp32c3"
    firmware_version: str = "1.0.0"

class DeviceHeartbeatMessage(BaseModel):
    type: str = "heartbeat"
    device_id: str

class DeviceStatusMessage(BaseModel):
    type: str = "status"
    device_id: str
    wifi: bool = True
    rssi: int = -50
    mic: bool = True
    speaker: bool = True
    oled: bool = True

class DeviceInfo(BaseModel):
    device_id: str
    status: str = "ONLINE"
    wifi_connected: bool = True
    rssi: int = -50
    mic_ready: bool = True
    speaker_ready: bool = True
    oled_ready: bool = True
    last_seen: str
    current_state: str = "IDLE"
