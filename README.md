# Sahayak AI — Multilingual Rural Governance & Legal Assistance Platform

Sahayak AI is an end-to-end voice-first, multilingual RAG-based rural assistance platform for farmers and cooperative members in India.

---

## 🗺️ Parallel Development Roadmap

```
                    SAHAYAK AI
                        │
                ┌───────┴────────┐
                │                │
          PHASE 2 + 3       PHASE 4+
                │                │
          DEVELOPER A       DEVELOPER B
          (My Friend)          (Me)
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

### Phase Allocation Matrix

- ✅ **Phase 1**: Backend Health + PostgreSQL / SQLite Database System (**COMPLETE**)
- 👤 **Developer A (Friend)**:
  - **Phase 2**: Document Ingestion + PostgreSQL/pgvector (`docs/PHASE_2_README.md`)
  - **Phase 3**: RAG + Citations (`docs/PHASE_3_README.md`)
- 👤 **Developer B (Me)**:
  - **Phase 4**: LLM Service Base & Prompt Engineering (`docs/PHASE_4_README.md`)
  - **Phase 5**: Frontend API Integration
  - **Phase 6**: Speech-to-Text (Whisper)
  - **Phase 7**: Text-to-Speech (TTS Engine)
  - **Phase 8**: ESP32 WiFi + WebSocket Protocols
  - **Phase 9**: 128x64 OLED Animations
  - **Phase 10**: I2S Microphone Recording
  - **Phase 11**: MAX98357A Speaker Playback
  - **Phase 12**: Complete End-to-End Voice Loop
  - **Phase 13**: Error Handling Telemetry
  - **Phase 14**: Security & API Key Verification
  - **Phase 15**: Production Deployment & Demonstration

---

## 📁 Parallel Development Architecture

- **Developer A Guide**: See [docs/PHASE_2_README.md](file:///c:/harsha%20studies/SIH%20CHAT/docs/PHASE_2_README.md) & [docs/PHASE_3_README.md](file:///c:/harsha%20studies/SIH%20CHAT/docs/PHASE_3_README.md).
- **Developer B Guide**: See [docs/PHASE_4_README.md](file:///c:/harsha%20studies/SIH%20CHAT/docs/PHASE_4_README.md).
- **Ownership Matrix**: See [docs/DEVELOPMENT_OWNERSHIP.md](file:///c:/harsha%20studies/SIH%20CHAT/docs/DEVELOPMENT_OWNERSHIP.md).
- **Merge Instructions**: See [docs/MERGE_PHASE_2_3.md](file:///c:/harsha%20studies/SIH%20CHAT/docs/MERGE_PHASE_2_3.md).

---

## ⚡ Quick Start

```bash
# 1. Start Frontend & Backend
double-click start.bat

# 2. Run Test Suite
cd backend
python -m pytest tests/
```
