"""
PHASE 2 — OCR ENGINE INTERFACE & IMPLEMENTATION
Developer A (Friend) Task: Handle scanned documents and images using Tesseract OCR fallback.
"""

import logging
from typing import Optional

logger = logging.getLogger("sahayak.rag.ingestion.ocr")

class BaseOCREngine:
    def process_scanned_pdf(self, file_path: str) -> str:
        """
        Extract text from scanned PDF or image using OCR.
        """
        raise NotImplementedError("Developer A: Implement process_scanned_pdf in Phase 2.")

class OCREngine(BaseOCREngine):
    def __init__(self, tesseract_cmd: Optional[str] = None):
        self.tesseract_cmd = tesseract_cmd
        self._tesseract_available: Optional[bool] = None

    def _check_tesseract(self) -> bool:
        if self._tesseract_available is not None:
            return self._tesseract_available
        try:
            import pytesseract
            if self.tesseract_cmd:
                pytesseract.pytesseract.tesseract_cmd = self.tesseract_cmd
            pytesseract.get_tesseract_version()
            self._tesseract_available = True
            logger.info("Tesseract OCR is available and initialized.")
        except Exception as e:
            self._tesseract_available = False
            logger.warning(f"Tesseract OCR is not available ({e}). Scanned PDF OCR will be skipped.")
        return self._tesseract_available

    def process_image(self, image_data) -> str:
        """Run OCR on a PIL Image object."""
        if not self._check_tesseract():
            return ""
        try:
            import pytesseract
            text = pytesseract.image_to_string(image_data, lang="eng+hin")
            return text.strip()
        except Exception as e:
            logger.error(f"Error during OCR image processing: {e}")
            return ""

    def process_scanned_pdf(self, file_path: str, max_pages: int = 15) -> str:
        """
        Extract text from scanned PDF pages when digital text layer is absent.
        Converts PDF pages to images and runs OCR.
        """
        if not self._check_tesseract():
            logger.debug(f"Skipping OCR for '{file_path}' (Tesseract unavailable).")
            return ""

        extracted_text = []
        try:
            import pdf2image
            images = pdf2image.convert_from_path(file_path, first_page=1, last_page=max_pages)
            for page_idx, img in enumerate(images):
                page_text = self.process_image(img)
                if page_text:
                    extracted_text.append(f"\n--- Page {page_idx + 1} (OCR) ---\n{page_text}")
        except Exception as e:
            logger.warning(f"Could not convert PDF '{file_path}' for OCR: {e}")

        return "\n".join(extracted_text)

ocr_engine = OCREngine()
