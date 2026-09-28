# PHASE 2 IMPLEMENTATION GUIDE — DOCUMENT INGESTION & PGVECTOR

**Assigned Developer**: Developer A (Friend)  
**Objective**: Build a robust, recursive PDF/text ingestion pipeline and store multilingual section-aware vector chunks in PostgreSQL + pgvector.

---

## 📋 Required Tasks

### 1. Document Scanning (`app/rag/ingestion/loader.py`)
- Recursively scan PDFs and text documents from `knowledge_base/` subfolders (`01_Agriculture`, `02_Cooperative`, `03_Finance`, `04_Grievance`, `05_Laws`).
- Calculate **SHA-256 file hash** for every file to detect duplicates and prevent re-ingestion of unchanged documents.

### 2. Text Extraction & OCR (`app/rag/ingestion/extractor.py` & `ocr.py`)
- Extract clean text from PDFs using `PyPDF2` or `pdfplumber`.
- Handle scanned PDF images using `pytesseract` / Tesseract OCR fallback when text layer is absent.

### 3. Text Cleaning (`app/rag/ingestion/cleaner.py`)
- Remove unwanted headers, footers, page number artifacts, and noise characters while preserving mathematical/number formatting.

### 4. Metadata Extraction (`app/rag/ingestion/metadata.py`)
- For every document, extract or infer structured metadata fields:
  - `title`, `domain`, `subdomain`, `language`, `state`, `authority`, `department`, `document_type`, `effective_date`, `version`, `official_source`, `source_url`, `last_verified`, `file_hash`, `status` (`ACTIVE` / `SUPERSEDED`).

### 5. Smart Section-Aware Chunking (`app/rag/ingestion/chunker.py`)
- Split document text into chunks of **500–1000 tokens** with **10–20% overlap**.
- Preserve section headings, chapter numbers, page numbers, and parent document ID.

### 6. Multilingual Embeddings (`app/rag/embeddings/embedder.py`)
- Use a strong multilingual embedding model (Recommended: `BAAI/bge-m3`).
- Configure embedding model via `.env`: `EMBEDDING_MODEL=BAAI/bge-m3`.

### 7. PostgreSQL + pgvector Storage
- Store embeddings in `document_chunks` table using `pgvector`.
