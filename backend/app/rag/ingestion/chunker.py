"""
PHASE 2 — TEXT CLEANER & SECTION-AWARE CHUNKER
Developer A (Friend) Task: Clean text and split by sections (500-1000 tokens, 10-20% overlap).
"""

from typing import List, Dict, Any

class BaseTextCleaner:
    def clean_text(self, text: str) -> str:
        """
        TODO (Developer A): Remove headers, footers, whitespace noise, and bad characters.
        """
        raise NotImplementedError("Developer A: Implement clean_text in Phase 2.")

class BaseChunker:
    def create_chunks(
        self,
        document_text: str,
        chunk_size: int = 800,
        chunk_overlap: int = 150
    ) -> List[Dict[str, Any]]:
        """
        TODO (Developer A): Implement section-aware chunking preserving chapter/section/page_number.
        """
        raise NotImplementedError("Developer A: Implement create_chunks in Phase 2.")
