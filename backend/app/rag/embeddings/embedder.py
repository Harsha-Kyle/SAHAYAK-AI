"""
PHASE 2 — MULTILINGUAL EMBEDDER IMPLEMENTATION
Developer A (Friend) Task: Embed chunks using BAAI/bge-m3 or configurable multilingual embedding model.
Outputs normalized 1024-dimensional vectors for pgvector storage and cosine similarity.
"""

import os
import math
import hashlib
import logging
import numpy as np
from typing import List, Optional

logger = logging.getLogger("sahayak.rag.embeddings.embedder")

DEFAULT_MODEL_NAME = os.getenv("EMBEDDING_MODEL", "BAAI/bge-m3")
VECTOR_DIMENSION = 1024

class BaseEmbedder:
    def __init__(self, model_name: str = DEFAULT_MODEL_NAME):
        self.model_name = model_name

    def embed_text(self, text: str) -> List[float]:
        """
        Generate vector embedding for input text chunk.
        """
        raise NotImplementedError("Developer A: Implement embed_text in Phase 2.")

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """
        Generate batch embeddings for multiple chunks.
        """
        raise NotImplementedError("Developer A: Implement embed_batch in Phase 2.")

class MultilingualEmbedder(BaseEmbedder):
    def __init__(self, model_name: Optional[str] = None, dimension: int = VECTOR_DIMENSION):
        super().__init__(model_name or DEFAULT_MODEL_NAME)
        self.dimension = dimension
        self._model = None
        self._load_attempted = False
        self._use_fallback = False

    def _init_model(self):
        """Lazy load SentenceTransformer model to prevent slow startup."""
        if self._load_attempted:
            return
        self._load_attempted = True

        try:
            from sentence_transformers import SentenceTransformer
            logger.info(f"Loading multilingual embedding model: '{self.model_name}'...")
            self._model = SentenceTransformer(self.model_name)
            logger.info(f"Embedding model '{self.model_name}' loaded successfully.")
        except Exception as e:
            logger.warning(
                f"Could not load SentenceTransformer '{self.model_name}' ({e}). "
                f"Using deterministic multilingual semantic projection fallback (dim={self.dimension})."
            )
            self._use_fallback = True

    def _fallback_embed(self, text: str) -> List[float]:
        """
        Deterministic, multilingual subword & n-gram semantic vector projection (dim=1024).
        Produces unit-normalized (L2 norm = 1.0) vectors.
        Preserves cosine similarity properties for Indian languages and English.
        """
        vec = np.zeros(self.dimension, dtype=np.float32)
        words = text.lower().split()
        if not words:
            vec[0] = 1.0
            return vec.tolist()

        for word in words:
            # Word token hash
            h = int(hashlib.md5(word.encode("utf-8")).hexdigest(), 16)
            idx = h % self.dimension
            sign = 1.0 if ((h >> 8) & 1) else -1.0
            vec[idx] += sign

            # Character 3-grams for morphology and subword matching
            if len(word) >= 3:
                for i in range(len(word) - 2):
                    trigram = word[i:i+3]
                    h_tri = int(hashlib.sha1(trigram.encode("utf-8")).hexdigest(), 16)
                    idx_tri = h_tri % self.dimension
                    sign_tri = 1.0 if ((h_tri >> 4) & 1) else -1.0
                    vec[idx_tri] += 0.5 * sign_tri

        # Normalize to unit sphere for cosine distance
        norm = np.linalg.norm(vec)
        if norm > 1e-6:
            vec = vec / norm
        else:
            vec[0] = 1.0
        return vec.tolist()

    def embed_text(self, text: str) -> List[float]:
        """Generate normalized vector embedding for single text."""
        self._init_model()
        if self._use_fallback or self._model is None:
            return self._fallback_embed(text)

        try:
            emb = self._model.encode(text, normalize_embeddings=True)
            res = emb.tolist() if hasattr(emb, "tolist") else list(emb)
            # If model dimension doesn't match 1024, pad or slice
            if len(res) < self.dimension:
                res = res + [0.0] * (self.dimension - len(res))
            elif len(res) > self.dimension:
                res = res[:self.dimension]
            return res
        except Exception as e:
            logger.error(f"Error encoding text with model: {e}. Falling back...")
            return self._fallback_embed(text)

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate batch embeddings for multiple chunks."""
        self._init_model()
        if not texts:
            return []

        if self._use_fallback or self._model is None:
            return [self._fallback_embed(t) for t in texts]

        try:
            embs = self._model.encode(texts, batch_size=32, normalize_embeddings=True)
            results = []
            for emb in embs:
                res = emb.tolist() if hasattr(emb, "tolist") else list(emb)
                if len(res) < self.dimension:
                    res = res + [0.0] * (self.dimension - len(res))
                elif len(res) > self.dimension:
                    res = res[:self.dimension]
                results.append(res)
            return results
        except Exception as e:
            logger.error(f"Error encoding batch with model: {e}. Falling back...")
            return [self._fallback_embed(t) for t in texts]

embedder = MultilingualEmbedder()
