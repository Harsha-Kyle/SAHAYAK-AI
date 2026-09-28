"""
PHASE 3 — VECTOR SEARCH IMPLEMENTATION
Developer A (Friend) Task: Perform pgvector cosine similarity search with metadata filtering
(domain, state, language, status == ACTIVE). Supports PostgreSQL pgvector and SQLite fallback.
"""

import logging
import numpy as np
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine
from app.db.models import DocumentModel, DocumentChunkModel

logger = logging.getLogger("sahayak.rag.retrieval.vector_search")

class BaseVectorSearch:
    def search_vectors(
        self,
        query_vector: List[float],
        top_k: int = 10,
        filters: Optional[Dict[str, Any]] = None,
        db_session: Optional[Session] = None
    ) -> List[Dict[str, Any]]:
        """
        Perform pgvector cosine similarity search filtered by domain/state/language.
        """
        raise NotImplementedError("Developer A: Implement search_vectors in Phase 3.")

class VectorSearch(BaseVectorSearch):
    def __init__(self):
        self.is_postgres = engine.dialect.name == "postgresql"

    def search_vectors(
        self,
        query_vector: List[float],
        top_k: int = 10,
        filters: Optional[Dict[str, Any]] = None,
        db_session: Optional[Session] = None
    ) -> List[Dict[str, Any]]:
        """
        Search document chunks using cosine similarity.
        Applies metadata filters: domain, state, language, status.
        """
        filters = filters or {}
        should_close_db = False
        db = db_session
        if db is None:
            db = SessionLocal()
            should_close_db = True

        results: List[Dict[str, Any]] = []
        try:
            # Build SQLAlchemy query joining DocumentChunkModel and DocumentModel
            query = db.query(DocumentChunkModel, DocumentModel).join(
                DocumentModel, DocumentChunkModel.document_id == DocumentModel.id
            )

            # Metadata filtering
            if filters.get("domain") and filters["domain"].lower() != "all":
                query = query.filter(DocumentChunkModel.domain.ilike(f"%{filters['domain']}%"))

            if filters.get("subdomain"):
                query = query.filter(DocumentChunkModel.subdomain.ilike(f"%{filters['subdomain']}%"))

            if filters.get("state") and filters["state"] not in {"All India", "National"}:
                query = query.filter(
                    (DocumentModel.state == filters["state"]) | (DocumentModel.state == "All India")
                )

            if filters.get("language") and filters["language"].lower() not in {"all", "any"}:
                query = query.filter(DocumentModel.language.ilike(filters["language"]))

            # Filter by ACTIVE status by default
            status_filter = filters.get("status", "ACTIVE")
            if status_filter:
                query = query.filter(DocumentModel.status == status_filter)

            q_vec = np.array(query_vector, dtype=np.float32)
            q_norm = np.linalg.norm(q_vec)
            if q_norm > 1e-6:
                q_vec = q_vec / q_norm

            # Branch 1: PostgreSQL native pgvector cosine search
            if self.is_postgres and hasattr(DocumentChunkModel.embedding, "cosine_distance"):
                try:
                    pg_query = query.order_by(
                        DocumentChunkModel.embedding.cosine_distance(query_vector)
                    ).limit(top_k)
                    
                    rows = pg_query.all()
                    for chunk, doc in rows:
                        # pgvector cosine_distance returns 1 - cosine_similarity
                        dist = 0.0
                        score = max(0.0, min(1.0, 1.0 - dist))
                        results.append(self._format_result(chunk, doc, score))
                    return results
                except Exception as e:
                    logger.warning(f"pgvector native search error ({e}). Using in-memory cosine fallback.")

            # Branch 2: SQLite / Generic Fallback Cosine Search
            rows = query.all()
            scored_candidates = []

            for chunk, doc in rows:
                emb = chunk.embedding
                if emb is None:
                    continue
                c_vec = np.array(emb, dtype=np.float32)
                c_norm = np.linalg.norm(c_vec)
                if c_norm > 1e-6:
                    c_vec = c_vec / c_norm
                    sim = float(np.dot(q_vec, c_vec))
                else:
                    sim = 0.0

                # True cosine similarity [0.0, 1.0] (negative similarity clamped to 0.0)
                normalized_score = max(0.0, min(1.0, float(sim)))
                scored_candidates.append((normalized_score, chunk, doc))

            # Sort by cosine similarity descending
            scored_candidates.sort(key=lambda x: x[0], reverse=True)

            for score, chunk, doc in scored_candidates[:top_k]:
                results.append(self._format_result(chunk, doc, score))

        except Exception as e:
            logger.error(f"Error in vector search: {e}", exc_info=True)
        finally:
            if should_close_db:
                db.close()

        return results

    def _format_result(self, chunk: DocumentChunkModel, doc: DocumentModel, score: float) -> Dict[str, Any]:
        return {
            "content": chunk.content,
            "document_id": doc.id,
            "title": doc.title or "Official Guideline",
            "page": chunk.page_number or 1,
            "section": chunk.section or "General",
            "domain": chunk.domain or doc.domain or "General",
            "subdomain": chunk.subdomain or doc.subdomain or "General",
            "state": doc.state or "All India",
            "language": doc.language or "English",
            "authority": doc.authority or doc.department or "Government Authority",
            "source_url": doc.source_url or "https://india.gov.in",
            "version": doc.version or "current",
            "status": doc.status or "ACTIVE",
            "confidence": round(score, 2),
            "vector_score": round(score, 4)
        }

vector_search = VectorSearch()
