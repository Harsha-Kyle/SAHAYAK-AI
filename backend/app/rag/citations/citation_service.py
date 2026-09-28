"""
PHASE 3 — CITATION SERVICE INTERFACE
Developer A (Friend) Task: Extract structured, non-hallucinated citations from retrieved document metadata.
"""

from typing import List, Dict, Any

class BaseCitationExtractor:
    def format_citations(self, chunks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        TODO (Developer A): Extract structured citations preserving title, page, section, authority, and official source URL.
        Never invent missing citations; use None if unavailable.
        """
        raise NotImplementedError("Developer A: Implement format_citations in Phase 3.")
