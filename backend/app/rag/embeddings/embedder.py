"""
PHASE 2 — MULTILINGUAL EMBEDDER INTERFACE
Developer A (Friend) Task: Embed chunks using BAAI/bge-m3 or configurable multilingual embedding model.
"""

from typing import List

class BaseEmbedder:
    def __init__(self, model_name: str = "BAAI/bge-m3"):
        self.model_name = model_name

    def embed_text(self, text: str) -> List[float]:
        """
        TODO (Developer A): Generate vector embedding for input text chunk.
        """
        raise NotImplementedError("Developer A: Implement embed_text in Phase 2.")

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """
        TODO (Developer A): Generate batch embeddings for multiple chunks.
        """
        raise NotImplementedError("Developer A: Implement embed_batch in Phase 2.")
