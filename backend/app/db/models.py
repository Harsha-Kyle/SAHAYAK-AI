from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class DocumentModel(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    domain = Column(String, index=True)
    subdomain = Column(String, index=True)
    language = Column(String, default="en")
    state = Column(String, default="All India")
    department = Column(String, nullable=True)
    document_type = Column(String, default="Guideline")
    effective_date = Column(String, nullable=True)
    version = Column(String, default="current")
    official_source = Column(String)
    source_url = Column(String, nullable=True)
    status = Column(String, default="ACTIVE")
    created_at = Column(DateTime, default=datetime.utcnow)

    chunks = relationship("DocumentChunkModel", back_populates="document", cascade="all, delete-orphan")

class DocumentChunkModel(Base):
    __tablename__ = "document_chunks"

    id = Column(String, primary_key=True, index=True)
    document_id = Column(String, ForeignKey("documents.id"))
    content = Column(Text)
    page_number = Column(Integer, default=1)
    section = Column(String, default="General")
    domain = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    document = relationship("DocumentModel", back_populates="chunks")

class ConversationModel(Base):
    __tablename__ = "conversations"

    id = Column(String, primary_key=True, index=True)
    session_id = Column(String, index=True)
    language = Column(String, default="en")
    created_at = Column(DateTime, default=datetime.utcnow)

    messages = relationship("MessageModel", back_populates="conversation", cascade="all, delete-orphan")

class MessageModel(Base):
    __tablename__ = "messages"

    id = Column(String, primary_key=True, index=True)
    conversation_id = Column(String, ForeignKey("conversations.id"))
    sender = Column(String) # 'user' or 'ai'
    text = Column(Text)
    confidence = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    conversation = relationship("ConversationModel", back_populates="messages")

class DeviceModel(Base):
    __tablename__ = "devices"

    id = Column(String, primary_key=True, index=True)
    device_id = Column(String, unique=True, index=True)
    device_type = Column(String, default="xiao-esp32c3")
    status = Column(String, default="ONLINE")
    wifi_connected = Column(Boolean, default=True)
    rssi = Column(Integer, default=-52)
    mic_ready = Column(Boolean, default=True)
    speaker_ready = Column(Boolean, default=True)
    oled_ready = Column(Boolean, default=True)
    current_state = Column(String, default="IDLE")
    last_seen = Column(DateTime, default=datetime.utcnow)
