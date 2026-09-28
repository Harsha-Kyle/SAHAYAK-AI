"""
PHASE 2 — DOCUMENT LOADER INTERFACE
Developer A (Friend) Task: Implement PDF & Document scanner for knowledge_base/ directory.
"""

from typing import List, Dict, Any

class BaseDocumentLoader:
    def load_directory(self, directory_path: str) -> List[Dict[str, Any]]:
        """
        TODO (Developer A): Recursively scan PDFs and text documents from directory_path.
        Calculate SHA-256 file hash for duplicate detection.
        Return raw document data dictionary list.
        """
        raise NotImplementedError("Developer A: Implement load_directory in Phase 2.")
