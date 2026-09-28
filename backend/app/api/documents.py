from fastapi import APIRouter

router = APIRouter()

OFFICIAL_DOCUMENT_SOURCES = [
    {
        "title": "PM-KISAN Operational Guidelines",
        "domain": "Agriculture",
        "subdomain": "PM-KISAN",
        "language": "English",
        "state": "All India",
        "department": "Ministry of Agriculture",
        "document_type": "Guideline",
        "effective_date": "2026-01-01",
        "official_source": "PM-KISAN Portal",
        "source_url": "https://pmkisan.gov.in",
        "last_verified": "2026-09-28",
        "status": "ACTIVE"
    },
    {
        "title": "PMFBY Revamped Operational Guidelines",
        "domain": "Agriculture",
        "subdomain": "Crop Insurance",
        "language": "English",
        "state": "All India",
        "department": "Ministry of Agriculture",
        "document_type": "Guideline",
        "effective_date": "2026-01-01",
        "official_source": "PMFBY Portal",
        "source_url": "https://pmfby.gov.in",
        "last_verified": "2026-09-20",
        "status": "ACTIVE"
    },
    {
        "title": "RBI Master Direction — Kisan Credit Card Scheme",
        "domain": "Finance",
        "subdomain": "KCC Loan",
        "language": "English",
        "state": "All India",
        "department": "Reserve Bank of India",
        "document_type": "Master Direction",
        "effective_date": "2026-01-01",
        "official_source": "RBI Guidelines",
        "source_url": "https://rbi.org.in",
        "last_verified": "2026-08-30",
        "status": "ACTIVE"
    },
    {
        "title": "Cooperative Societies Act & Model Bye-Laws",
        "domain": "Cooperative",
        "subdomain": "PACS Membership",
        "language": "English",
        "state": "All India",
        "department": "Ministry of Cooperation",
        "document_type": "Act & Rules",
        "effective_date": "2026-01-01",
        "official_source": "Cooperative Registrar Office",
        "source_url": "https://cooperation.gov.in",
        "last_verified": "2026-07-18",
        "status": "ACTIVE"
    }
]

@router.get("/sources")
def get_official_sources():
    return OFFICIAL_DOCUMENT_SOURCES
