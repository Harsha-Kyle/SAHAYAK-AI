from pydantic import BaseModel
from typing import Optional, List

class GrievanceAnalysisRequest(BaseModel):
    issue_description: str
    scheme_or_service: Optional[str] = None
    language: str = "en"

class GrievanceAnalysisResponse(BaseModel):
    domain: str
    subdomain: str
    intent: str
    potential_causes: List[str]
    verification_steps: List[str]
    required_documents: List[str]
    complaint_authority: str
    escalation_path: List[str]
    official_source: str
