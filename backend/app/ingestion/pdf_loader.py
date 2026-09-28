import os
import logging
from typing import List, Dict, Any

logger = logging.getLogger("sahayak.ingestion.pdf")

class PDFLoader:
    @staticmethod
    def load_documents_from_folder(base_folder: str) -> List[Dict[str, Any]]:
        """Recursively scan folders for PDF / text documents and extract content."""
        documents = []
        if not os.path.exists(base_folder):
            logger.warning(f"Knowledge Base path '{base_folder}' does not exist.")
            return documents

        for root, _, files in os.walk(base_folder):
            for file in files:
                file_path = os.path.join(root, file)
                domain = os.path.basename(root)

                if file.endswith(".pdf"):
                    try:
                        import PyPDF2
                        with open(file_path, "rb") as f:
                            reader = PyPDF2.PdfReader(f)
                            text = ""
                            for page_num, page in enumerate(reader.pages):
                                text += f"\n--- Page {page_num + 1} ---\n" + (page.extract_text() or "")
                            documents.append({
                                "file_path": file_path,
                                "filename": file,
                                "domain": domain,
                                "content": text
                            })
                    except Exception as e:
                        logger.error(f"Error parsing PDF '{file_path}': {e}")
                elif file.endswith(".txt") or file.endswith(".md"):
                    try:
                        with open(file_path, "r", encoding="utf-8") as f:
                            text = f.read()
                        documents.append({
                            "file_path": file_path,
                            "filename": file,
                            "domain": domain,
                            "content": text
                        })
                    except Exception as e:
                        logger.error(f"Error reading text document '{file_path}': {e}")

        logger.info(f"Loaded {len(documents)} documents from '{base_folder}'")
        return documents

pdf_loader = PDFLoader()
