"""
PHASE 2 — SECTION-AWARE CHUNKER IMPLEMENTATION
Developer A (Friend) Task: Split document text into chunks of 500-1000 tokens (10-20% overlap),
preserving section headings, chapter numbers, and page numbers.
"""

import re
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger("sahayak.rag.ingestion.chunker")

SECTION_PATTERN = re.compile(
    r"^(?:(?:Sec\.?|Section|Chapter|Clause|Rule|Part|Article|Para\.?)\s*[\dA-Za-z\.\-\:]+|[0-9]{1,2}\.\s+[A-Z][A-Za-z\s]{3,60}|[A-Z\s]{4,50}:)$",
    re.IGNORECASE | re.MULTILINE
)

class BaseChunker:
    def create_chunks(
        self,
        document_text: str,
        chunk_size: int = 800,
        chunk_overlap: int = 150
    ) -> List[Dict[str, Any]]:
        """
        Split document into section-aware chunks.
        """
        raise NotImplementedError("Developer A: Implement create_chunks in Phase 2.")

class SectionAwareChunker(BaseChunker):
    def __init__(self, default_chunk_size: int = 700, default_overlap: int = 120):
        self.default_chunk_size = default_chunk_size
        self.default_overlap = default_overlap

    def _split_into_page_blocks(self, text: str) -> List[Dict[str, Any]]:
        """
        Split text annotated with '--- Page X ---' markers into discrete page units.
        """
        pages = []
        raw_parts = text.split("--- Page ")
        
        for part in raw_parts:
            part_str = part.strip()
            if not part_str:
                continue
            
            lines = part_str.split("\n", 1)
            first_line = lines[0].strip()
            
            page_num = 1
            body = part_str
            # Check if first line starts with page number like "4 ---" or "4"
            match = re.match(r"^(\d+)", first_line)
            if match:
                try:
                    page_num = int(match.group(1))
                    body = lines[1] if len(lines) > 1 else ""
                except (ValueError, IndexError):
                    pass
            
            pages.append({"page_number": page_num, "text": body.strip()})

        if not pages and text.strip():
            pages.append({"page_number": 1, "text": text.strip()})
        return pages

    def create_chunks(
        self,
        document_text: str,
        chunk_size: Optional[int] = None,
        chunk_overlap: Optional[int] = None,
        document_id: str = "doc_unknown",
        metadata: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """
        Split document by sections and pages into chunks of 500-1000 tokens (approx 400-800 words),
        with 10-20% overlap, preserving section headings and page metadata.
        """
        c_size = chunk_size or self.default_chunk_size
        c_overlap = chunk_overlap or self.default_overlap
        meta = metadata or {}

        page_blocks = self._split_into_page_blocks(document_text)
        all_chunks: List[Dict[str, Any]] = []

        current_section = meta.get("subdomain") or meta.get("title") or "General Provisions"
        chunk_index = 0

        for page in page_blocks:
            page_num = page["page_number"]
            page_text = page["text"]
            if not page_text:
                continue

            paragraphs = page_text.split("\n\n")
            current_buffer = ""
            current_buffer_words = 0

            for para in paragraphs:
                para_clean = para.strip()
                if not para_clean:
                    continue

                # Check if paragraph is a section heading
                first_line = para_clean.split("\n")[0].strip()
                if (len(first_line) < 100 and (
                    SECTION_PATTERN.match(first_line) or
                    any(keyword in first_line.lower() for keyword in ["eligibility", "benefit", "guideline", "exclusion", "procedure", "penalty", "dispute", "audit", "membership", "scheme overview", "scope", "definition"])
                )):
                    current_section = first_line

                words = para_clean.split()
                para_word_count = len(words)

                if current_buffer_words + para_word_count > c_size and current_buffer:
                    chunk_id = f"{document_id}_p{page_num}_c{chunk_index}"
                    all_chunks.append({
                        "id": chunk_id,
                        "document_id": document_id,
                        "content": current_buffer.strip(),
                        "page_number": page_num,
                        "section": current_section,
                        "domain": meta.get("domain", "General"),
                        "subdomain": meta.get("subdomain", "General"),
                        "title": meta.get("title", "Official Guideline"),
                        "authority": meta.get("authority", "Government of India"),
                        "state": meta.get("state", "All India"),
                        "language": meta.get("language", "English"),
                        "source_url": meta.get("source_url"),
                        "status": meta.get("status", "ACTIVE")
                    })
                    chunk_index += 1

                    # Compute overlap from end of current buffer
                    buffer_words = current_buffer.split()
                    overlap_words = buffer_words[-c_overlap:] if len(buffer_words) > c_overlap else []
                    current_buffer = " ".join(overlap_words) + "\n\n" + para_clean
                    current_buffer_words = len(overlap_words) + para_word_count
                else:
                    if current_buffer:
                        current_buffer += "\n\n" + para_clean
                    else:
                        current_buffer = para_clean
                    current_buffer_words += para_word_count

            # Finalize remaining text for the page
            if current_buffer.strip():
                chunk_id = f"{document_id}_p{page_num}_c{chunk_index}"
                all_chunks.append({
                    "id": chunk_id,
                    "document_id": document_id,
                    "content": current_buffer.strip(),
                    "page_number": page_num,
                    "section": current_section,
                    "domain": meta.get("domain", "General"),
                    "subdomain": meta.get("subdomain", "General"),
                    "title": meta.get("title", "Official Guideline"),
                    "authority": meta.get("authority", "Government of India"),
                    "state": meta.get("state", "All India"),
                    "language": meta.get("language", "English"),
                    "source_url": meta.get("source_url"),
                    "status": meta.get("status", "ACTIVE")
                })
                chunk_index += 1

        logger.info(f"Chunked document '{document_id}' into {len(all_chunks)} section-aware chunks.")
        return all_chunks

chunker = SectionAwareChunker()
