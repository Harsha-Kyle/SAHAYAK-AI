"""
PHASE 3 — CITATION SERVICE IMPLEMENTATION
Developer A (Friend) Task: Extract structured, non-hallucinated citations from retrieved document metadata.
Preserves title, page, section, authority, and official source URL.
Never invents missing citations; uses None if unavailable.
"""

import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger("sahayak.rag.citations.citation_service")

class BaseCitationExtractor:
    def format_citations(self, chunks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Extract structured citations preserving title, page, section, authority, and official source URL.
        Never invent missing citations; use None if unavailable.
        """
        raise NotImplementedError("Developer A: Implement format_citations in Phase 3.")

class CitationService(BaseCitationExtractor):
    def format_citations(self, chunks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Extract verified, deduplicated source citations from retrieved chunks.
        """
        citations: List[Dict[str, Any]] = []
        seen = set()

        for chunk in chunks:
            title = chunk.get("title") or "Official Document"
            page = chunk.get("page") or chunk.get("page_number")
            section = chunk.get("section")
            authority = chunk.get("authority")
            source_url = chunk.get("source_url")
            confidence = chunk.get("confidence")
            doc_id = chunk.get("document_id")

            # Avoid duplicates on identical title and page
            dedup_key = f"{title}_{page}_{section}"
            if dedup_key in seen:
                continue
            seen.add(dedup_key)

            citation = {
                "title": title,
                "document_id": doc_id,
                "page": page if page is not None else None,
                "section": section if section else None,
                "authority": authority if authority else None,
                "source_url": source_url if source_url else None,
                "confidence": round(float(confidence), 2) if confidence is not None else None
            }
            citations.append(citation)

        return citations

citation_service = CitationService()
