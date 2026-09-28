# FILE OWNERSHIP MATRIX

## 🟢 Developer A (Friend) Ownership
- `app/rag/` (all subfolders: `ingestion/`, `embeddings/`, `retrieval/`, `citations/`)
- `app/services/rag_service.py`
- `knowledge_base/`
- RAG migrations & ingestion scripts (`scripts/ingest_documents.py`)
- RAG unit tests (`tests/test_rag_contract.py`)
- `docs/PHASE_2_README.md` & `docs/PHASE_3_README.md`

## 🔵 Developer B (Me) Ownership
- `app/services/llm_service.py`
- `app/core/llm_config.py`
- `app/services/stt_service.py`
- `app/services/tts_service.py`
- `app/hardware/` & `firmware/` (ESP32-C3 firmware)
- `src/` (Frontend React Web UI)
- `docs/PHASE_4_README.md`
- `tests/test_llm_contract.py`

## ⚠️ DO NOT OVERWRITE RULES
Developer A must NOT overwrite Developer B's files (`llm_service.py`, `stt_service.py`, `tts_service.py`, `src/`, `firmware/`).
Developer B will merge Developer A's RAG package cleanly following `docs/MERGE_PHASE_2_3.md`.
