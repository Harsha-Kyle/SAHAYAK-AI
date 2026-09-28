import os
from dotenv import load_dotenv

# Load backend/.env file
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"))

class Settings:
    PROJECT_NAME: str = "Sahayak AI Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"

    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sahayak.db")

    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    ASSEMBLYAI_API_KEY: str = os.getenv("ASSEMBLYAI_API_KEY", "")

    STT_MODEL: str = os.getenv("STT_MODEL", "small")
    TTS_PROVIDER: str = os.getenv("TTS_PROVIDER", "edge-tts")

    ESP32_API_KEY: str = os.getenv("ESP32_API_KEY", "sahayak_secret_esp32_key_2026")

    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ]

settings = Settings()

