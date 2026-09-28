# PARALLEL DEVELOPMENT ROADMAP & WORKFLOW

```
                    SAHAYAK AI
                        │
                ┌───────┴────────┐
                │                │
          PHASE 2 + 3       PHASE 4+
                │                │
             FRIEND              ME
                │                │
          RAG / pgvector       LLM
                              Frontend
                                STT
                                TTS
                               ESP32
                                OLED
                                Mic
                              Speaker
```

---

## 🔄 Parallel Workflow Strategy

1. **Independent Development**:
   - **Friend (Developer A)** works inside `app/rag/`, `knowledge_base/`, and `app/services/rag_service.py`.
   - **Me (Developer B)** works inside `app/services/llm_service.py`, `app/core/llm_config.py`, frontend, STT/TTS, and ESP32 firmware.

2. **Stable Interface Contract**:
   - The boundary between RAG and LLM is defined by `RAGService.search(...)` output contract.
   - LLM does NOT query PostgreSQL/pgvector directly.
   - RAG does NOT handle LLM prompt generation or TTS.

3. **Merging Phase 2 & 3**:
   - When Friend completes Phase 2 & 3, follow instructions in `docs/MERGE_PHASE_2_3.md` to safely merge RAG modules without overwriting LLM, STT, TTS, frontend, or hardware files.
