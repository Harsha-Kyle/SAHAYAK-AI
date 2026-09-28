from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class DocumentMetadata(BaseModel):
    title: str
    domain: str
    subdomain: str
    language: str = "en"
    state: str = "All India"
    department: Optional[str] = "Ministry of Agriculture"
    document_type: str = "Guideline"
    effective_date: Optional[str] = "2026-01-01"
    version: str = "current"
    official_source: str
    source_url: Optional[str] = None
    last_verified: str = "2026-09-28"
    status: str = "ACTIVE"

class DocumentChunk(BaseModel):
    id: str
    document_id: str
    content: str
    page_number: Optional[int] = 1
    section: Optional[str] = "General"
    metadata: DocumentMetadata
    similarity_score: Optional[float] = None
