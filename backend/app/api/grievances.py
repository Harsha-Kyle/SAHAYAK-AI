from fastapi import APIRouter
from app.models.query import GrievanceAnalysisRequest, GrievanceAnalysisResponse

router = APIRouter()

@router.post("/grievance/analyze", response_model=GrievanceAnalysisResponse)
def analyze_grievance(request: GrievanceAnalysisRequest):
    desc_lower = request.issue_description.lower()

    if "crop" in desc_lower or "pmfby" in desc_lower or "insurance" in desc_lower:
        return GrievanceAnalysisResponse(
            domain="Agriculture",
            subdomain="Crop Insurance (PMFBY)",
            intent="Payment Delay / Loss Claim Rejection",
            potential_causes=[
                "Field inspection report pending from insurance company",
                "Crop loss notification not submitted within 72-hour cut-off window",
                "Bank account Aadhaar seeding mismatch"
            ],
            verification_steps=[
                "Check claim status on PMFBY portal using policy application number",
                "Verify Aadhaar bank seeding status on UIDAI portal",
                "Confirm sowing certificate submission with Village Agricultural Officer"
            ],
            required_documents=[
                "PMFBY Policy Number / Application Receipt",
                "Field photos of damaged crop",
                "Aadhaar Card",
                "Bank Passbook statement"
            ],
            complaint_authority="District Agriculture Officer / PMFBY Toll-Free Helpdesk",
            escalation_path=[
                "1. PMFBY Helpline (14447)",
                "2. District Level Grievance Redressal Committee chaired by District Collector",
                "3. State Insurance Nodal Officer"
            ],
            official_source="PMFBY Revamped Guidelines — Sec. 19 (Localised Calamities)"
        )
    
    # Default PM-KISAN / Loan Grievance
    return GrievanceAnalysisResponse(
        domain="Agriculture / Finance",
        subdomain="PM-KISAN / PACS Loan",
        intent="Payment Delay / Account e-KYC Pending",
        potential_causes=[
            "e-KYC authentication incomplete",
            "Land record verification pending at Land Reforms Department",
            "PFMS bank account rejection"
        ],
        verification_steps=[
            "Check PM-KISAN Beneficiary Status on pmkisan.gov.in using Aadhaar number",
            "Complete e-KYC via OTP or fingerprint at nearest CSC center",
            "Verify land Patta linkage"
        ],
        required_documents=[
            "Aadhaar Card",
            "Land Patta / Khatauni document",
            "Bank Passbook"
        ],
        complaint_authority="Block Development Officer (BDO) / PACS Secretary",
        escalation_path=[
            "1. PM-KISAN Nodal Officer at Block Level",
            "2. District Agriculture Officer",
            "3. PM-KISAN Helpline (155261 / 011-24300606)"
        ],
        official_source="PM-KISAN Operational Guidelines — Sec. 4 & 6"
    )
