# STEP-BY-STEP MERGE INSTRUCTIONS FOR PHASE 2 & 3

When Developer A finishes Phase 2 & Phase 3, follow this procedure:

---

### Step 1: Backup Current Project
```bash
git checkout -b feature/llm-development
git status
```

### Step 2: Copy RAG Files
Copy only these files/folders from Developer A:
- `app/rag/`
- `app/services/rag_service.py`
- `knowledge_base/`
- RAG tests (`tests/test_rag_contract.py`)

### Step 3: DO NOT OVERWRITE
Do NOT overwrite:
- `app/services/llm_service.py`
- `app/services/stt_service.py`
- `app/services/tts_service.py`
- `src/` (Frontend UI)
- `firmware/` (ESP32 code)

### Step 4: Apply Database Migrations & Install Dependencies
```bash
cd backend
pip install -r requirements.txt
python scripts/ingest_documents.py
```

### Step 5: Run Contract Tests
```bash
pytest tests/test_rag_contract.py
pytest tests/test_llm_contract.py
```
