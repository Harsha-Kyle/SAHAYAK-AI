"""
SAHAYAK AI — RAG SERVICE INTERFACE CONTRACT (PHASE 3)
Allocated to: Developer A (Friend)
Stable boundary interface between RAG Retrieval and LLM Generation.
"""

from typing import Optional, List, Dict, Any

class RAGService:
    def search(
        self,
        query: str,
        state: Optional[str] = None,
        domain: Optional[str] = None,
        language: Optional[str] = None,
        top_k: int = 5
    ) -> Dict[str, Any]:
        """
        Stable RAG Contract Method.
        Developer A (Friend) will replace internal pgvector logic during Phase 2/3.
        MUST return output structured contract matching:
        {
          "query": str,
          "results": List[Dict],
          "retrieval_confidence": float,
          "insufficient_evidence": bool
        }
        """
        # Contract-compliant baseline for independent Phase 4 testing
        q_lower = query.lower()
        
        if "pm-kisan" in q_lower or "kisan" in q_lower or "6000" in q_lower:
            return {
                "query": query,
                "results": [
                    {
                        "content": "PM-KISAN Samman Nidhi provides income support of ₹6,000 per year for landholding farmer families in 3 equal instalments of ₹2,000. Mandatory e-KYC is required.",
                        "document_id": "doc-pmkisan-01",
                        "title": "PM-KISAN Operational Guidelines",
                        "page": 4,
                        "section": "Sec. 4 — Eligibility",
                        "domain": domain or "Agriculture",
                        "subdomain": "PM-KISAN",
                        "state": state or "All India",
                        "language": language or "English",
                        "authority": "Ministry of Agriculture",
                        "source_url": "https://pmkisan.gov.in",
                        "version": "current",
                        "status": "ACTIVE",
                        "confidence": 0.94
                    }
                ],
                "retrieval_confidence": 0.94,
                "insufficient_evidence": False
            }

        return {
            "query": query,
            "results": [],
            "retrieval_confidence": 0.20,
            "insufficient_evidence": True
        }

rag_service = RAGService()
