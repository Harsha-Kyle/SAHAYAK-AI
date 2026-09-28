"""
PHASE 3 — KEYWORD SEARCH IMPLEMENTATION (BM25)
Developer A (Friend) Task: Perform BM25 keyword search filtered by domain/state/language.
"""

import re
import logging
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models import DocumentModel, DocumentChunkModel

logger = logging.getLogger("sahayak.rag.retrieval.keyword_search")

TOKEN_SPLIT_REGEX = re.compile(r"[\s\.,;:!?'\"\(\)\[\]\{\}\<\>/\\]+")

def tokenize(text: str) -> List[str]:
    """Tokenize query and content, preserving alphanumeric words, hyphenated terms, and symbols."""
    raw_tokens = TOKEN_SPLIT_REGEX.split(text.lower())
    return [t for t in raw_tokens if len(t) > 1 or t in {"₹", "rs"}]

class BaseKeywordSearch:
    def search_keywords(
        self,
        query: str,
        top_k: int = 10,
        filters: Optional[Dict[str, Any]] = None,
        db_session: Optional[Session] = None
    ) -> List[Dict[str, Any]]:
        """
        Perform BM25 keyword search.
        """
        raise NotImplementedError("Developer A: Implement search_keywords in Phase 3.")

class KeywordSearch(BaseKeywordSearch):
    def search_keywords(
        self,
        query: str,
        top_k: int = 10,
        filters: Optional[Dict[str, Any]] = None,
        db_session: Optional[Session] = None
    ) -> List[Dict[str, Any]]:
        """
        Perform BM25 search over document chunks with metadata filtering.
        """
        filters = filters or {}
        should_close_db = False
        db = db_session
        if db is None:
            db = SessionLocal()
            should_close_db = True

        results: List[Dict[str, Any]] = []
        try:
            # Query candidates from DB matching metadata filters
            db_query = db.query(DocumentChunkModel, DocumentModel).join(
                DocumentModel, DocumentChunkModel.document_id == DocumentModel.id
            )

            if filters.get("domain") and filters["domain"].lower() != "all":
                db_query = db_query.filter(DocumentChunkModel.domain.ilike(f"%{filters['domain']}%"))

            if filters.get("subdomain"):
                db_query = db_query.filter(DocumentChunkModel.subdomain.ilike(f"%{filters['subdomain']}%"))

            if filters.get("state") and filters["state"] not in {"All India", "National"}:
                db_query = db_query.filter(
                    (DocumentModel.state == filters["state"]) | (DocumentModel.state == "All India")
                )

            if filters.get("language") and filters["language"].lower() not in {"all", "any"}:
                db_query = db_query.filter(DocumentModel.language.ilike(filters["language"]))

            status_filter = filters.get("status", "ACTIVE")
            if status_filter:
                db_query = db_query.filter(DocumentModel.status == status_filter)

            rows = db_query.all()
            if not rows:
                return results

            query_tokens = tokenize(query)
            if not query_tokens:
                return results

            # Attempt rank_bm25 BM25Okapi
            corpus_tokens = []
            chunk_records = []
            for chunk, doc in rows:
                c_tokens = tokenize(f"{doc.title} {chunk.section} {chunk.content}")
                corpus_tokens.append(c_tokens)
                chunk_records.append((chunk, doc))

            try:
                from rank_bm25 import BM25Okapi
                bm25 = BM25Okapi(corpus_tokens)
                scores = bm25.get_scores(query_tokens)
            except Exception as e:
                logger.warning(f"rank_bm25 failed ({e}), using term-overlap fallback.")
                scores = []
                q_set = set(query_tokens)
                for tokens in corpus_tokens:
                    overlap = sum(1 for t in tokens if t in q_set)
                    scores.append(float(overlap))

            max_score = max(scores) if len(scores) > 0 and max(scores) > 0 else 1.0

            scored_candidates = []
            for idx, score in enumerate(scores):
                if score > 0.01:
                    norm_score = min(1.0, score / max_score)
                    chunk, doc = chunk_records[idx]
                    scored_candidates.append((norm_score, chunk, doc))

            scored_candidates.sort(key=lambda x: x[0], reverse=True)

            for score, chunk, doc in scored_candidates[:top_k]:
                results.append({
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
                    "bm25_score": round(score, 4)
                })

        except Exception as e:
            logger.error(f"Error in keyword search: {e}", exc_info=True)
        finally:
            if should_close_db:
                db.close()

        return results

keyword_search = KeywordSearch()
