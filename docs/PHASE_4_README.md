# PHASE 4 IMPLEMENTATION GUIDE — LLM SERVICE & PROMPT ENGINEERING

**Assigned Developer**: Developer B (Me)  
**Objective**: Build Ollama LLM integration, prompt engineering, refusal handling, and multilingual preparation.

---

## 🛠️ Key Capabilities

- **Zero DB Dependency**: Receives structured context directly from `RAGService` or manual test context arrays.
- **Ollama Model Testing**: Test local Ollama models (`qwen3.5`, `gemma`, `mistral`, `phi`) via environment variables without hardcoding.
- **Strict Non-Hallucination Policy**: Returns mandatory refusal message when context is empty or `"insufficient_evidence": true`.

---

## 💻 Input / Output Contract

### Call:
```python
response = await llm_service.generate(
    query="Am I eligible for PM-KISAN money?",
    context=[{ "content": "...", "title": "PM-KISAN Guidelines", "page": 4 }],
    system_prompt=None,
    original_language="en"
)
```

### Output:
```json
{
  "answer": "PM-KISAN provides ₹6,000 per year...",
  "sources": [{ "title": "PM-KISAN Guidelines", "page": 4, "section": "Sec. 4" }],
  "confidence": 0.94,
  "insufficient_evidence": false
}
```
