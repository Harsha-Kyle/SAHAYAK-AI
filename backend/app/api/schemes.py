from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any

router = APIRouter()

OFFICIAL_SCHEMES = [
    {
        "id": "pmkisan",
        "title": "PM-KISAN Samman Nidhi",
        "domain": "Agriculture",
        "benefit": "₹6,000 per year in 3 instalments of ₹2,000 directly to bank accounts",
        "eligibility": "Landholding farmer families with cultivable land",
        "required_documents": ["Aadhaar Card", "Patta / Khatauni Land Record", "Bank Passbook"],
        "official_url": "https://pmkisan.gov.in"
    },
    {
        "id": "pmfby",
        "title": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        "domain": "Agriculture",
        "benefit": "Comprehensive crop loss insurance coverage against drought, flood, pests",
        "eligibility": "All farmers growing notified crops in notified areas",
        "required_documents": ["Aadhaar Card", "Land Record / Tenancy Agreement", "Sowing Certificate"],
        "official_url": "https://pmfby.gov.in"
    },
    {
        "id": "kcc",
        "title": "Kisan Credit Card (KCC)",
        "domain": "Finance",
        "benefit": "Short-term crop loan up to ₹3 lakh at 4% effective interest upon prompt repayment",
        "eligibility": "Owner farmers, tenant farmers, sharecroppers, SHGs",
        "required_documents": ["Aadhaar Card", "Land Record", "Passport Photo", "Bank Passbook"],
        "official_url": "https://rbi.org.in"
    },
    {
        "id": "pacs-membership",
        "title": "PACS Membership & Governance",
        "domain": "Cooperative",
        "benefit": "Fertilizer at fair prices, crop loans, voting rights, dividend share",
        "eligibility": "Adult farmers living in the PACS operational area",
        "required_documents": ["Aadhaar Card", "Residence Proof", "Share Money Fee"],
        "official_url": "https://cooperation.gov.in"
    }
]

@router.get("/schemes")
def get_schemes():
    return OFFICIAL_SCHEMES

@router.get("/schemes/{scheme_id}")
def get_scheme_by_id(scheme_id: str):
    scheme = next((s for s in OFFICIAL_SCHEMES if s["id"] == scheme_id), None)
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return scheme
