from enum import Enum
from pydantic import BaseModel
from typing import Optional, Any, Dict

class DeviceState(str, Enum):
    IDLE = "IDLE"
    LISTENING = "LISTENING"
    THINKING = "THINKING"
    SPEAKING = "SPEAKING"
    ERROR = "ERROR"
    OFFLINE = "OFFLINE"

class WSMessage(BaseModel):
    type: str
    device_id: Optional[str] = None
    payload: Optional[Dict[str, Any]] = None
