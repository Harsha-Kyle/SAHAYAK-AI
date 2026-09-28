import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

logger = logging.getLogger("sahayak.db")

# Use SQLite fallback if PostgreSQL is not available locally
DATABASE_URL = settings.DATABASE_URL

if DATABASE_URL.startswith("postgresql"):
    try:
        engine = create_engine(DATABASE_URL, pool_pre_ping=True)
        # Test connection
        with engine.connect() as conn:
            pass
        logger.info("Connected to PostgreSQL database.")
    except Exception as e:
        logger.warning(f"PostgreSQL connection failed ({e}). Falling back to local SQLite database.")
        DATABASE_URL = "sqlite:///./sahayak.db"
        engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
