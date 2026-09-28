from fastapi import HTTPException, Security, status
from fastapi.security import APIKeyHeader
from app.core.config import settings

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

def verify_esp32_key(api_key: str = Security(api_key_header)) -> bool:
    if api_key and api_key == settings.ESP32_API_KEY:
        return True
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or missing ESP32 API Key",
    )
