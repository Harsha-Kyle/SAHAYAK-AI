import os

class LLMConfig:
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "qwen3.5")
    OLLAMA_TIMEOUT: float = float(os.getenv("OLLAMA_TIMEOUT", "20.0"))

    # Configurable LLM Parameters for Phase 4 Developer
    TEMPERATURE: float = float(os.getenv("LLM_TEMPERATURE", "0.2"))
    MAX_TOKENS: int = int(os.getenv("LLM_MAX_TOKENS", "1024"))

llm_config = LLMConfig()
