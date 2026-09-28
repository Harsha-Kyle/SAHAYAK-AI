"""
PHASE 2 — METADATA EXTRACTOR
Developer A (Friend) Task: Extract structured metadata for every government document.
Required metadata fields:
- title, domain, subdomain, language, state, authority, department,
  document_type, effective_date, version, official_source, source_url,
  last_verified, file_hash, status (ACTIVE / SUPERSEDED)
"""

from typing import Dict, Any

class BaseMetadataExtractor:
    def extract_metadata(self, file_path: str, content: str) -> Dict[str, Any]:
        """
        TODO (Developer A): Extract or infer document metadata from folder hierarchy and header text.
        """
        raise NotImplementedError("Developer A: Implement extract_metadata in Phase 2.")
