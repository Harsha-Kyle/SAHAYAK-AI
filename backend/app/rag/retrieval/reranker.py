"""
PHASE 3 — RERANKER IMPLEMENTATION
Developer A (Friend) Task: Candidate fusion, Reciprocal Rank Fusion (RRF),
exact term boosting, de-duplication, and low-confidence threshold gating.
"""

import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger("sahayak.rag.retrieval.reranker")

CONFIDENCE_THRESHOLD = 0.40
MIN_RAW_COSINE       = 0.50   # gate: if best vector similarity < this, refuse regardless of hybrid score

class BaseReranker:
    def rerank(
        self,
        query: str,
        candidates: List[Dict[str, Any]],
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Combine candidates and rerank using Cross-Encoder or score fusion.
        """
        raise NotImplementedError("Developer A: Implement rerank in Phase 3.")

class CandidateReranker(BaseReranker):
    def __init__(self, confidence_threshold: float = CONFIDENCE_THRESHOLD):
        self.confidence_threshold = confidence_threshold

    def fuse_and_rerank(
        self,
        query: str,
        vector_candidates: List[Dict[str, Any]],
        keyword_candidates: List[Dict[str, Any]],
        top_k: int = 5,
        alpha: float = 0.60,
        rrf_k: int = 60
    ) -> Dict[str, Any]:
        """
        Hybrid Candidate Fusion:
        1. Calculates RRF (Reciprocal Rank Fusion) score from vector and keyword rank positions.
        2. Combines normalized cosine similarity and BM25 score.
        3. Applies exact phrase and keyword bonus for government schemes.
        4. Deduplicates overlapping sections from the same document.
        5. Computes overall retrieval confidence and sets insufficient_evidence flag.
        """
        combined: Dict[str, Dict[str, Any]] = {}
        q_lower = query.lower()

        # Step 1: Ingest vector search candidates
        for rank, c in enumerate(vector_candidates):
            key = f"{c.get('document_id')}_{c.get('page')}_{c.get('section')}"
            if key not in combined:
                combined[key] = dict(c)
                combined[key]["vector_score"] = float(c.get("vector_score", c.get("confidence", 0.0)))
                combined[key]["bm25_score"] = 0.0
                combined[key]["rrf_score"] = 0.0
            combined[key]["rrf_score"] += 1.0 / (rrf_k + rank + 1)

        # Step 2: Ingest keyword search candidates
        for rank, c in enumerate(keyword_candidates):
            key = f"{c.get('document_id')}_{c.get('page')}_{c.get('section')}"
            if key not in combined:
                combined[key] = dict(c)
                combined[key]["vector_score"] = 0.0
                combined[key]["bm25_score"] = float(c.get("bm25_score", c.get("confidence", 0.0)))
                combined[key]["rrf_score"] = 0.0
            else:
                combined[key]["bm25_score"] = float(c.get("bm25_score", c.get("confidence", 0.0)))
            combined[key]["rrf_score"] += 1.0 / (rrf_k + rank + 1)

        if not combined:
            return {
                "results": [],
                "retrieval_confidence": 0.0,
                "insufficient_evidence": True
            }

        # Step 3: Compute final hybrid score and exact match boost
        scored_list = []
        for item in combined.values():
            v_score = item["vector_score"]
            k_score = item["bm25_score"]
            rrf = item["rrf_score"]

            # Hybrid linear combination + RRF bonus
            score = (alpha * v_score) + ((1.0 - alpha) * k_score) + (rrf * 2.0)

            # Query keyword boost (if query words directly match title or subdomain)
            title_lower = (item.get("title") or "").lower()
            subdomain_lower = (item.get("subdomain") or "").lower()
            section_lower = (item.get("section") or "").lower()
            content_lower = (item.get("content") or "").lower()

            match_boost = 0.0
            for term in q_lower.split():
                if len(term) >= 3:
                    if term in title_lower or term in subdomain_lower:
                        match_boost += 0.08
                    elif term in section_lower:
                        match_boost += 0.05
                    elif term in content_lower:
                        match_boost += 0.02

            total_score = min(0.99, max(0.0, score + match_boost))
            item["confidence"] = round(total_score, 2)
            scored_list.append(item)

        # Sort by confidence descending
        scored_list.sort(key=lambda x: x["confidence"], reverse=True)
        top_results = scored_list[:top_k]

        # Step 4: Confidence check, insufficient evidence determination
        top_confidence = top_results[0]["confidence"] if top_results else 0.0

        # Raw cosine gate — prevents RRF/BM25 inflation from masking off-domain queries
        max_raw_cosine = max(
            (item.get("vector_score", 0.0) for item in scored_list),
            default=0.0
        )
        insufficient_evidence = (
            (top_confidence < self.confidence_threshold)
            or (max_raw_cosine < MIN_RAW_COSINE)
            or (len(top_results) == 0)
        )

        return {
            "results": top_results,
            "retrieval_confidence": top_confidence,
            "insufficient_evidence": insufficient_evidence
        }

    def rerank(
        self,
        query: str,
        candidates: List[Dict[str, Any]],
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Simple rerank method implementing BaseReranker interface.
        """
        res = self.fuse_and_rerank(query, candidates, [], top_k=top_k)
        return res["results"]

reranker = CandidateReranker()
