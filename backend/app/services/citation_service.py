from typing import List, Dict, Any
from app.models.conversation import SourceCitation

class CitationService:
    @staticmethod
    def build_citations(retrieved_chunks: List[Dict[str, Any]]) -> List[SourceCitation]:
        citations = []
        seen = set()
        for chunk in retrieved_chunks:
            meta = chunk.get("metadata", {})
            title = meta.get("title", "Official Document")
            page = chunk.get("page_number", 1)
            domain = meta.get("domain", "General")
            source_url = meta.get("source_url")
            score = float(chunk.get("similarity_score", 0.85))

            key = f"{title}_{page}"
            if key not in seen:
                seen.add(key)
                citations.append(SourceCitation(
                    title=title,
                    page=page,
                    domain=domain,
                    source_url=source_url,
                    confidence=round(score, 2)
                ))
        return citations

citation_service = CitationService()
