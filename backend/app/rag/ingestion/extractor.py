"""
PHASE 2 — TEXT EXTRACTOR & OCR INTERFACES
Developer A (Friend) Task: Extract text from PDFs and handle scanned documents.
"""

from typing import Dict, Any

class BaseTextExtractor:
    def extract_text(self, file_path: str) -> str:
        """
        TODO (Developer A): Extract clean text from PDF using PyPDF2 / pdfplumber.
        """
        raise NotImplementedError("Developer A: Implement extract_text in Phase 2.")

class BaseOCREngine:
    def process_scanned_pdf(self, file_path: str) -> str:
        """
        TODO (Developer A): Implement Tesseract OCR fallback for scanned images/PDFs.
        """
        raise NotImplementedError("Developer A: Implement process_scanned_pdf in Phase 2.")
