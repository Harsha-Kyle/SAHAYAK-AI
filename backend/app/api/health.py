from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.config import settings
from app.db.database import get_db, engine, Base
import app.db.models as models

router = APIRouter()

# Create tables if not present
try:
    Base.metadata.create_all(bind=engine)
except Exception:
    pass

@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    db_status = "connected"
    db_type = "postgresql" if settings.DATABASE_URL.startswith("postgresql") else "sqlite"
    
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "phase": "Phase 1: Backend Health + Database System",
        "database": {
            "status": db_status,
            "type": db_type,
            "url_configured": settings.DATABASE_URL.split("@")[-1] if "@" in settings.DATABASE_URL else "local_sqlite"
        },
        "services": {
            "llm_engine": "Gemini 1.5 Flash (Primary)",
            "stt_engine": "AssemblyAI STT",
            "tts_engine": settings.TTS_PROVIDER
        }

    }
