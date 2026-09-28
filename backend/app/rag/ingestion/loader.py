"""
PHASE 2 — DOCUMENT LOADER IMPLEMENTATION
Developer A (Friend) Task: Implement PDF & Document scanner for knowledge_base/ directory.
Recursively scans files, computes SHA-256 hash, and detects duplicates.
"""

import os
import hashlib
import logging
from typing import List, Dict, Any, Set, Optional

logger = logging.getLogger("sahayak.rag.ingestion.loader")

SUPPORTED_EXTENSIONS = {".pdf", ".txt", ".md", ".json"}

DOMAIN_MAPPING = {
    "01_agriculture": "Agriculture",
    "02_cooperative": "Cooperative",
    "03_finance": "Finance",
    "04_grievance": "Grievance",
    "05_laws": "Laws",
    "agriculture": "Agriculture",
    "cooperative": "Cooperative",
    "finance": "Finance",
    "grievance": "Grievance",
    "laws": "Laws"
}

def compute_sha256(file_path: str) -> str:
    """Calculate SHA-256 hash of a file to detect duplicates and track version changes."""
    hasher = hashlib.sha256()
    with open(file_path, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()

def infer_domain_from_path(file_path: str, base_dir: str) -> str:
    """Infer domain from folder hierarchy relative to base_dir."""
    rel_path = os.path.relpath(file_path, base_dir)
    parts = rel_path.replace("\\", "/").split("/")
    if len(parts) > 1:
        top_folder = parts[0].lower()
        for key, domain in DOMAIN_MAPPING.items():
            if key in top_folder:
                return domain
    return "General"

def infer_subdomain_from_path(file_path: str, base_dir: str) -> str:
    """Infer subdomain from subfolder or filename."""
    rel_path = os.path.relpath(file_path, base_dir)
    parts = rel_path.replace("\\", "/").split("/")
    if len(parts) > 2:
        return parts[1]
    filename = os.path.splitext(os.path.basename(file_path))[0].lower()
    if "pm-kisan" in filename or "pmkisan" in filename:
        return "PM-KISAN"
    if "pmfby" in filename or "crop" in filename:
        return "PMFBY"
    if "kusum" in filename:
        return "PM-KUSUM"
    if "pacs" in filename or "byelaw" in filename:
        return "PACS Membership"
    if "kcc" in filename or "credit" in filename:
        return "KCC Loan"
    if "fraud" in filename or "aware" in filename:
        return "Financial Fraud Protection"
    if "act" in filename or "law" in filename:
        return "Cooperative Act"
    if "grievance" in filename:
        return "Grievance Redressal"
    return "General"

class BaseDocumentLoader:
    def load_directory(self, directory_path: str) -> List[Dict[str, Any]]:
        """
        Recursively scan PDFs and text documents from directory_path.
        Calculate SHA-256 file hash for duplicate detection.
        Return raw document data dictionary list.
        """
        raise NotImplementedError("Developer A: Implement load_directory in Phase 2.")

class DocumentLoader(BaseDocumentLoader):
    def __init__(self, supported_extensions: Optional[Set[str]] = None):
        self.supported_extensions = supported_extensions or SUPPORTED_EXTENSIONS
        self.seen_hashes: Set[str] = set()

    def load_directory(
        self,
        directory_path: str,
        skip_duplicates: bool = True
    ) -> List[Dict[str, Any]]:
        """
        Recursively scan directory_path for supported files (.pdf, .txt, .md).
        Calculates SHA-256 hash to filter exact duplicate files.
        """
        loaded_documents: List[Dict[str, Any]] = []

        if not os.path.exists(directory_path):
            logger.warning(f"Directory not found: '{directory_path}'")
            return loaded_documents

        logger.info(f"Scanning directory for documents: {directory_path}")

        for root, _, files in os.walk(directory_path):
            for file in sorted(files):
                ext = os.path.splitext(file)[1].lower()
                if ext not in self.supported_extensions:
                    continue

                file_path = os.path.join(root, file)
                try:
                    file_size = os.path.getsize(file_path)
                    file_hash = compute_sha256(file_path)

                    if skip_duplicates and file_hash in self.seen_hashes:
                        logger.info(f"Skipping duplicate file (hash {file_hash[:8]}): {file}")
                        continue

                    self.seen_hashes.add(file_hash)
                    domain = infer_domain_from_path(file_path, directory_path)
                    subdomain = infer_subdomain_from_path(file_path, directory_path)

                    loaded_documents.append({
                        "file_path": file_path,
                        "filename": file,
                        "file_extension": ext,
                        "file_size": file_size,
                        "file_hash": file_hash,
                        "domain": domain,
                        "subdomain": subdomain,
                        "relative_path": os.path.relpath(file_path, directory_path)
                    })
                except Exception as e:
                    logger.error(f"Error scanning file '{file_path}': {e}")

        logger.info(f"Scan complete. Found {len(loaded_documents)} unique documents in '{directory_path}'.")
        return loaded_documents

document_loader = DocumentLoader()
