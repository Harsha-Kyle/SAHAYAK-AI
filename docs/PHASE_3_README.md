# PHASE 3 IMPLEMENTATION GUIDE — HYBRID RAG RETRIEVAL & CITATIONS

**Assigned Developer**: Developer A (Friend)  
**Objective**: Implement hybrid vector + keyword retrieval, metadata filtering, reranking, and citation formatting.

---

## 🔍 Retrieval Architecture

```
User Query
    ↓
Query Embedding (BAAI/bge-m3)
    ↓
Vector Search (pgvector) + BM25 Keyword Search
    ↓
Metadata Filtering (domain, subdomain, state, language, authority, status='ACTIVE')
    ↓
Candidate Fusion & Reranking
    ↓
Top Results + Structured Citations
```

---

## 📋 Required Tasks

### 1. Hybrid Search & Filtering (`app/rag/retrieval/vector_search.py`)
- Combine cosine vector similarity search with keyword search.
- Filter candidates by metadata fields (`domain`, `state`, `language`, `status == ACTIVE`).

### 2. Reranker (`app/rag/retrieval/reranker.py`)
- Rerank top candidates using Cross-Encoder or reciprocity score fusion.

### 3. Citations (`app/rag/citations/citation_service.py`)
- Extract clean citations from document metadata (title, page, section, authority, source_url).
- Never invent missing citation fields; set to `null` if unavailable.

### 4. Low Confidence & Evidence Check
- If retrieval confidence score is below threshold (e.g., < 0.40):
  Set `"insufficient_evidence": true` in the output contract.

---

## 🤝 Stable RAG Output Contract

Your `RAGService.search()` implementation in `app/services/rag_service.py` MUST return this exact JSON structure:

```json
{
  "query": "What is PM-KISAN?",
  "results": [
    {
      "content": "PM-KISAN Samman Nidhi provides income support of ₹6,000 per year...",
      "document_id": "doc-pmkisan-01",
      "title": "PM-KISAN Operational Guidelines",
      "page": 4,
      "section": "Sec. 4 — Eligibility",
      "domain": "Agriculture",
      "subdomain": "PM-KISAN",
      "state": "All India",
      "language": "English",
      "authority": "Ministry of Agriculture",
      "source_url": "https://pmkisan.gov.in",
      "version": "current",
      "status": "ACTIVE",
      "confidence": 0.94
    }
  ],
  "retrieval_confidence": 0.94,
  "insufficient_evidence": false
}
```
