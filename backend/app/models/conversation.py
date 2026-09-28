from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class SourceCitation(BaseModel):
    title: str
    page: Optional[int] = 1
    domain: str
    source_url: Optional[str] = None
    confidence: float

class ChatRequest(BaseModel):
    message: str
    language: str = "en"
    session_id: Optional[str] = "default_session"
    device_id: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
    language: str
    sources: List[SourceCitation] = []
    confidence: float
    session_id: str
    audio_url: Optional[str] = None
