import os
import sys
import logging

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.ingestion.pdf_loader import pdf_loader
from app.ingestion.chunker import chunker

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ingest_script")

def run_ingestion():
    kb_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "knowledge_base")
    logger.info(f"Scanning Knowledge Base directory: {kb_dir}")

    docs = pdf_loader.load_documents_from_folder(kb_dir)
    total_chunks = 0

    for doc in docs:
        chunks = chunker.chunk_document(doc)
        total_chunks += len(chunks)
        logger.info(f"Ingested '{doc['filename']}' ({len(chunks)} section chunks)")

    logger.info(f"✅ Ingestion Complete! Total Documents: {len(docs)}, Total Chunks: {total_chunks}")

if __name__ == "__main__":
    run_ingestion()
