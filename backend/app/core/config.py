import os

class Settings:
    PROJECT_NAME: str = "Sahayak AI Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"

    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sahayak.db")

    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "qwen3.5")

    STT_MODEL: str = os.getenv("STT_MODEL", "small")
    TTS_PROVIDER: str = os.getenv("TTS_PROVIDER", "gtts")

    ESP32_API_KEY: str = os.getenv("ESP32_API_KEY", "sahayak_secret_esp32_key_2026")

    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ]

settings = Settings()
