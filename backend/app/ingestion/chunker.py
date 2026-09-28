import logging
from typing import List, Dict, Any

logger = logging.getLogger("sahayak.ingestion.chunker")

class SectionAwareChunker:
    @staticmethod
    def chunk_document(doc: Dict[str, Any], chunk_size: int = 600, overlap: int = 100) -> List[Dict[str, Any]]:
        """Split document by sections or pages while preserving headings and metadata."""
        content = doc.get("content", "")
        chunks = []
        filename = doc.get("filename", "Doc")
        domain = doc.get("domain", "General")

        pages = content.split("--- Page ")
        for page_data in pages:
            if not page_data.strip():
                continue
            lines = page_data.split("\n")
            page_num = 1
            if lines[0].split(" ")[0].isdigit():
                try:
                    page_num = int(lines[0].split(" ")[0])
                except ValueError:
                    pass

            text_body = "\n".join(lines[1:]) if len(lines) > 1 else page_data

            # Section aware splitting
            paragraphs = text_body.split("\n\n")
            current_chunk = ""
            section_heading = "General Guidelines"

            for para in paragraphs:
                para_clean = para.strip()
                if not para_clean:
                    continue
                if len(para_clean) < 60 and ("Sec" in para_clean or "Para" in para_clean or "Chapter" in para_clean or "1." in para_clean):
                    section_heading = para_clean

                if len(current_chunk) + len(para_clean) > chunk_size and current_chunk:
                    chunks.append({
                        "content": current_chunk.strip(),
                        "page_number": page_num,
                        "section": section_heading,
                        "filename": filename,
                        "domain": domain
                    })
                    current_chunk = para_clean
                else:
                    current_chunk += "\n" + para_clean

            if current_chunk.strip():
                chunks.append({
                    "content": current_chunk.strip(),
                    "page_number": page_num,
                    "section": section_heading,
                    "filename": filename,
                    "domain": domain
                })

        return chunks

chunker = SectionAwareChunker()
