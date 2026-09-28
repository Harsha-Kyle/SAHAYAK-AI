"""
PHASE 2 — METADATA EXTRACTOR IMPLEMENTATION
Developer A (Friend) Task: Extract structured metadata for every government document.
Required metadata fields:
- title, domain, subdomain, language, state, authority, department,
  document_type, effective_date, version, official_source, source_url,
  last_verified, file_hash, status (ACTIVE / SUPERSEDED)
"""

import os
import re
from datetime import datetime
from typing import Dict, Any, Optional

class BaseMetadataExtractor:
    def extract_metadata(self, file_path: str, content: str) -> Dict[str, Any]:
        """
        Extract or infer document metadata from folder hierarchy and header text.
        """
        raise NotImplementedError("Developer A: Implement extract_metadata in Phase 2.")

KNOWN_METADATA_REGISTRY = {
    "pm-kisan": {
        "title": "PM-KISAN Operational Guidelines",
        "domain": "Agriculture",
        "subdomain": "PM-KISAN",
        "language": "English",
        "state": "All India",
        "authority": "Ministry of Agriculture and Farmers Welfare",
        "department": "Department of Agriculture and Farmers Welfare",
        "document_type": "Operational Guidelines",
        "effective_date": "2024-01-01",
        "official_source": "PM-KISAN Portal",
        "source_url": "https://pmkisan.gov.in",
        "version": "current",
        "status": "ACTIVE"
    },
    "pmfby": {
        "title": "PMFBY Revamped Operational Guidelines",
        "domain": "Agriculture",
        "subdomain": "Crop Insurance",
        "language": "English",
        "state": "All India",
        "authority": "Ministry of Agriculture and Farmers Welfare",
        "department": "Credit & Insurance Division",
        "document_type": "Operational Guidelines",
        "effective_date": "2020-08-17",
        "official_source": "PMFBY Portal",
        "source_url": "https://pmfby.gov.in",
        "version": "current",
        "status": "ACTIVE"
    },
    "rwbcis": {
        "title": "Restructured Weather Based Crop Insurance Scheme (RWBCIS) Guidelines",
        "domain": "Agriculture",
        "subdomain": "Crop Insurance",
        "language": "English",
        "state": "All India",
        "authority": "Ministry of Agriculture and Farmers Welfare",
        "department": "Department of Agriculture and Farmers Welfare",
        "document_type": "Guidelines",
        "effective_date": "2020-01-01",
        "official_source": "Ministry of Agriculture Portal",
        "source_url": "https://pmfby.gov.in",
        "version": "current",
        "status": "ACTIVE"
    },
    "kusum": {
        "title": "PM-KUSUM Solar Scheme Operational Guidelines",
        "domain": "Agriculture",
        "subdomain": "PM-KUSUM",
        "language": "English",
        "state": "All India",
        "authority": "Ministry of New and Renewable Energy",
        "department": "Solar Energy Division",
        "document_type": "Operational Guidelines",
        "effective_date": "2022-08-01",
        "official_source": "MNRE Portal",
        "source_url": "https://pmkusum.mnre.gov.in",
        "version": "current",
        "status": "ACTIVE"
    },
    "model_byelaw": {
        "title": "Model Bye-Laws for Primary Agricultural Credit Societies (PACS)",
        "domain": "Cooperative",
        "subdomain": "PACS Membership",
        "language": "English",
        "state": "All India",
        "authority": "Ministry of Cooperation",
        "department": "Central Registrar of Cooperative Societies",
        "document_type": "Model Bye-Laws",
        "effective_date": "2023-01-05",
        "official_source": "Ministry of Cooperation Portal",
        "source_url": "https://cooperation.gov.in",
        "version": "2023",
        "status": "ACTIVE"
    },
    "strengthening_cooperative": {
        "title": "Guidelines on Strengthening Cooperative Movement at Grassroots",
        "domain": "Cooperative",
        "subdomain": "Cooperative Expansion",
        "language": "English",
        "state": "All India",
        "authority": "Ministry of Cooperation",
        "department": "Policy & Planning Division",
        "document_type": "Plan Guidelines",
        "effective_date": "2023-06-12",
        "official_source": "Ministry of Cooperation",
        "source_url": "https://cooperation.gov.in",
        "version": "current",
        "status": "ACTIVE"
    },
    "tamil_nadu_cooperative": {
        "title": "Tamil Nadu Cooperative Societies Act & Rules",
        "domain": "Laws",
        "subdomain": "Cooperative Law",
        "language": "English",
        "state": "Tamil Nadu",
        "authority": "Government of Tamil Nadu, Cooperation Department",
        "department": "Registrar of Cooperative Societies",
        "document_type": "State Act & Rules",
        "effective_date": "1988-04-13",
        "official_source": "Tamil Nadu Cooperative Portal",
        "source_url": "https://cms.tn.gov.in",
        "version": "Amended",
        "status": "ACTIVE"
    },
    "be_aware": {
        "title": "RBI BE AWARE — Financial Fraud Protection Booklet",
        "domain": "Finance",
        "subdomain": "Financial Fraud Protection",
        "language": "English",
        "state": "All India",
        "authority": "Reserve Bank of India",
        "department": "Consumer Education and Protection Department",
        "document_type": "Public Awareness Booklet",
        "effective_date": "2022-03-07",
        "official_source": "RBI Portal",
        "source_url": "https://rbi.org.in",
        "version": "current",
        "status": "ACTIVE"
    },
    "financial_education": {
        "title": "Financial Education Handbook for Citizens",
        "domain": "Finance",
        "subdomain": "Financial Literacy",
        "language": "English",
        "state": "All India",
        "authority": "National Centre for Financial Education / RBI",
        "department": "Financial Inclusion Department",
        "document_type": "Handbook",
        "effective_date": "2021-01-01",
        "official_source": "NCFE Portal",
        "source_url": "https://ncfe.org.in",
        "version": "current",
        "status": "ACTIVE"
    },
    "national_strategy": {
        "title": "National Strategy for Financial Education (NSFE)",
        "domain": "Finance",
        "subdomain": "Financial Inclusion",
        "language": "English",
        "state": "All India",
        "authority": "Reserve Bank of India / FSDC",
        "department": "Financial Inclusion and Development Department",
        "document_type": "Strategy Document",
        "effective_date": "2020-01-01",
        "official_source": "RBI Guidelines",
        "source_url": "https://rbi.org.in",
        "version": "2020-2025",
        "status": "ACTIVE"
    },
    "grievance_redressal": {
        "title": "Citizen Grievance Redressal Policy",
        "domain": "Grievance",
        "subdomain": "Public Grievance",
        "language": "English",
        "state": "All India",
        "authority": "Department of Administrative Reforms and Public Grievances",
        "department": "DARPG",
        "document_type": "Policy Guidelines",
        "effective_date": "2023-01-01",
        "official_source": "CPGRAMS Portal",
        "source_url": "https://pgportal.gov.in",
        "version": "current",
        "status": "ACTIVE"
    },
    "dopt_om": {
        "title": "DoPT Official Memorandum on Grievance Disposal",
        "domain": "Grievance",
        "subdomain": "Public Grievance",
        "language": "English",
        "state": "All India",
        "authority": "Department of Personnel and Training",
        "department": "DoPT",
        "document_type": "Official Memorandum",
        "effective_date": "2013-08-31",
        "official_source": "DoPT Portal",
        "source_url": "https://dopt.gov.in",
        "version": "current",
        "status": "ACTIVE"
    },
    "policyholder": {
        "title": "Protection of Policyholders Interests Policy",
        "domain": "Grievance",
        "subdomain": "Insurance Grievance",
        "language": "English",
        "state": "All India",
        "authority": "Insurance Regulatory and Development Authority of India",
        "department": "Consumer Affairs Department",
        "document_type": "Regulatory Policy",
        "effective_date": "2022-01-01",
        "official_source": "IRDAI Portal",
        "source_url": "https://irdai.gov.in",
        "version": "current",
        "status": "ACTIVE"
    },
    "cooperative_societies_legal": {
        "title": "Cooperative Societies Legal Framework & Act Provisions",
        "domain": "Laws",
        "subdomain": "Cooperative Law",
        "language": "English",
        "state": "All India",
        "authority": "Ministry of Cooperation",
        "department": "Central Registrar of Cooperative Societies",
        "document_type": "Act & Rules",
        "effective_date": "2023-01-01",
        "official_source": "Ministry of Cooperation",
        "source_url": "https://cooperation.gov.in",
        "version": "current",
        "status": "ACTIVE"
    }
}

class MetadataExtractor(BaseMetadataExtractor):
    def extract_metadata(
        self,
        file_path: str,
        content: str,
        file_hash: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Extract or infer structured metadata for any document.
        Checks known government document signatures first, then infers
        from path hierarchy and document content.
        """
        filename_lower = os.path.basename(file_path).lower()

        # Check known registry
        for key, meta in KNOWN_METADATA_REGISTRY.items():
            if key in filename_lower:
                result = dict(meta)
                result["file_hash"] = file_hash or ""
                result["last_verified"] = "2026-09-28"
                return result

        # Dynamic fallback inference
        domain = "General"
        path_lower = file_path.lower().replace("\\", "/")
        if "01_agriculture" in path_lower or "agriculture" in path_lower:
            domain = "Agriculture"
        elif "02_cooperative" in path_lower or "cooperative" in path_lower:
            domain = "Cooperative"
        elif "03_finance" in path_lower or "finance" in path_lower:
            domain = "Finance"
        elif "04_grievance" in path_lower or "grievance" in path_lower:
            domain = "Grievance"
        elif "05_laws" in path_lower or "laws" in path_lower:
            domain = "Laws"

        # Infer title from first non-empty lines
        title = ""
        lines = [l.strip() for l in content.splitlines() if l.strip() and not l.strip().startswith("--- Page")]
        if lines:
            title = lines[0][:120]
        if not title or len(title) < 5:
            title = os.path.splitext(os.path.basename(file_path))[0].replace("_", " ").title()

        # State detection
        state = "All India"
        for st in ["Tamil Nadu", "Maharashtra", "Gujarat", "Punjab", "Uttar Pradesh", "Karnataka", "Kerala", "Bihar", "Rajasthan", "Madhya Pradesh", "Haryana", "Andhra Pradesh", "Telangana"]:
            if st.lower() in content[:1500].lower() or st.lower() in filename_lower:
                state = st
                break

        # Language detection (check Devanagari / Tamil Unicode ranges)
        language = "English"
        if re.search(r"[\u0900-\u097F]", content[:1000]):
            language = "Hindi"
        elif re.search(r"[\u0B80-\u0BFF]", content[:1000]):
            language = "Tamil"

        # Authority
        authority = "Government Authority"
        if "Ministry of Agriculture" in content or domain == "Agriculture":
            authority = "Ministry of Agriculture & Farmers Welfare"
        elif "Ministry of Cooperation" in content or domain == "Cooperative":
            authority = "Ministry of Cooperation"
        elif "Reserve Bank of India" in content or "RBI" in content or domain == "Finance":
            authority = "Reserve Bank of India"
        elif "Grievance" in domain or "DARPG" in content:
            authority = "Department of Administrative Reforms and Public Grievances"

        return {
            "title": title,
            "domain": domain,
            "subdomain": domain,
            "language": language,
            "state": state,
            "authority": authority,
            "department": authority,
            "document_type": "Official Guideline",
            "effective_date": "2024-01-01",
            "version": "current",
            "official_source": authority,
            "source_url": "https://india.gov.in",
            "last_verified": "2026-09-28",
            "file_hash": file_hash or "",
            "status": "ACTIVE"
        }

metadata_extractor = MetadataExtractor()
