"""
PHASE 3 — HYBRID RETRIEVAL & RERANKER INTERFACES
Developer A (Friend) Task: Implement Vector Search (pgvector) + BM25 Keyword Search + Reranker.
"""

from typing import List, Dict, Any

class BaseVectorSearch:
    def search_vectors(
        self,
        query_vector: List[float],
        top_k: int = 10,
        filters: Dict[str, Any] = None
    ) -> List[Dict[str, Any]]:
        """
        TODO (Developer A): Perform pgvector cosine similarity search filtered by domain/state/language.
        """
        raise NotImplementedError("Developer A: Implement search_vectors in Phase 3.")

class BaseKeywordSearch:
    def search_keywords(
        self,
        query: str,
        top_k: int = 10,
        filters: Dict[str, Any] = None
    ) -> List[Dict[str, Any]]:
        """
        TODO (Developer A): Perform PostgreSQL full-text / BM25 keyword search.
        """
        raise NotImplementedError("Developer A: Implement search_keywords in Phase 3.")

class BaseReranker:
    def rerank(
        self,
        query: str,
        candidates: List[Dict[str, Any]],
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """
        TODO (Developer A): Combine candidates and rerank using Cross-Encoder or score fusion.
        """
        raise NotImplementedError("Developer A: Implement rerank in Phase 3.")
