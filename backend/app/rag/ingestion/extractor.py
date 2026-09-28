"""
PHASE 2 — TEXT EXTRACTOR & OCR INTERFACES
Developer A (Friend) Task: Extract clean text from PDFs and handle scanned documents.
"""

import os
import logging
from typing import Dict, Any, List, Optional
from app.rag.ingestion.ocr import BaseOCREngine, OCREngine, ocr_engine

logger = logging.getLogger("sahayak.rag.ingestion.extractor")

class BaseTextExtractor:
    def extract_text(self, file_path: str) -> str:
        """
        Extract clean text from PDF using PyPDF2 / pdfplumber.
        """
        raise NotImplementedError("Developer A: Implement extract_text in Phase 2.")

class TextExtractor(BaseTextExtractor):
    def __init__(self, ocr: Optional[BaseOCREngine] = None):
        self.ocr = ocr or ocr_engine

    def extract_from_pdf(self, file_path: str) -> str:
        """
        Extract text from PDF using pdfplumber, falling back to PyPDF2.
        If pages contain no extractable text, attempts OCR.
        """
        page_texts: List[str] = []
        used_plumber = False

        # Attempt 1: pdfplumber (best for layout and tables)
        try:
            import pdfplumber
            with pdfplumber.open(file_path) as pdf:
                for idx, page in enumerate(pdf.pages):
                    text = page.extract_text() or ""
                    # If page has very little text, try extract_tables or clean text
                    if not text.strip():
                        tables = page.extract_tables()
                        if tables:
                            table_rows = [" | ".join(str(cell or "") for cell in row) for table in tables for row in table]
                            text = "\n".join(table_rows)
                    page_texts.append(f"\n--- Page {idx + 1} ---\n{text.strip()}")
            used_plumber = True
        except Exception as e:
            logger.debug(f"pdfplumber extraction failed for '{file_path}' ({e}), trying PyPDF2...")

        # Attempt 2: PyPDF2 fallback if pdfplumber failed or yielded nothing
        total_extracted_len = sum(len(p) for p in page_texts)
        if not used_plumber or total_extracted_len < 100:
            try:
                import PyPDF2
                page_texts = []
                with open(file_path, "rb") as f:
                    reader = PyPDF2.PdfReader(f)
                    for idx, page in enumerate(reader.pages):
                        text = page.extract_text() or ""
                        page_texts.append(f"\n--- Page {idx + 1} ---\n{text.strip()}")
            except Exception as e:
                logger.error(f"PyPDF2 failed for '{file_path}': {e}")

        # Check if text is essentially empty (scanned PDF)
        combined_text = "\n".join(page_texts).strip()
        non_marker_chars = sum(len(line) for line in combined_text.splitlines() if not line.startswith("--- Page"))
        if non_marker_chars < 80:
            logger.info(f"Digital text absent in '{file_path}' ({non_marker_chars} chars). Invoking OCR fallback...")
            ocr_text = self.ocr.process_scanned_pdf(file_path)
            if ocr_text:
                return ocr_text

        return combined_text

    def extract_from_text_file(self, file_path: str) -> str:
        """Extract text from plain text or markdown files."""
        encodings = ["utf-8", "utf-8-sig", "latin-1", "cp1252"]
        for enc in encodings:
            try:
                with open(file_path, "r", encoding=enc) as f:
                    return f.read()
            except UnicodeDecodeError:
                continue
            except Exception as e:
                logger.error(f"Error reading '{file_path}' with {enc}: {e}")
                break
        return ""

    def extract_text(self, file_path: str) -> str:
        """
        Unified extractor for PDFs, TXT, MD, and other text documents.
        """
        ext = os.path.splitext(file_path)[1].lower()
        if ext == ".pdf":
            return self.extract_from_pdf(file_path)
        elif ext in {".txt", ".md", ".json"}:
            return self.extract_from_text_file(file_path)
        else:
            logger.warning(f"Unsupported file format: {ext} for '{file_path}'")
            return ""

text_extractor = TextExtractor()
