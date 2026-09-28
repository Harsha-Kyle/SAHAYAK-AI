"""
SAHAYAK AI — LLM SERVICE (PHASE 4 BASE)
Allocated to: Developer B (Me)
Receives structured context from RAGService (or manual test context) and generates grounded answers via Ollama.
"""

import logging
import httpx
from typing import List, Dict, Any, Optional
from app.core.llm_config import llm_config

logger = logging.getLogger("sahayak.llm")

REFUSAL_MESSAGE = "I could not find sufficient verified information in the official Sahayak AI knowledge base."

class LLMService:
    async def generate(
        self,
        query: str,
        context: List[Dict[str, Any]],
        system_prompt: Optional[str] = None,
        original_language: str = "en"
    ) -> Dict[str, Any]:
        """
        Phase 4 Working LLM Generation Base.
        Does NOT query PostgreSQL/pgvector directly.
        Accepts structured context list from RAGService or manual test context.
        """
        # Strict context check
        if not context:
            return {
                "answer": REFUSAL_MESSAGE,
                "sources": [],
                "confidence": 0.0,
                "insufficient_evidence": True
            }

        context_text = "\n\n".join([
            f"Document: {chunk.get('title', 'Official Document')}\n"
            f"Section: {chunk.get('section', 'General')}\n"
            f"Authority: {chunk.get('authority', 'Government Dept')}\n"
            f"Content: {chunk.get('content', '')}"
            for chunk in context
        ])

        default_system_prompt = (
            "You are Sahayak AI, an official multilingual rural governance assistant for farmers and cooperative members in India. "
            "Your answer MUST be strictly grounded in the official government context provided below. "
            "DO NOT invent government rules, scheme amounts, phone numbers, or dates.\n\n"
            f"OFFICIAL CONTEXT:\n{context_text}"
        )

        prompt_to_use = system_prompt or default_system_prompt

        # Extract sources from context
        sources = [
            {
                "title": chunk.get("title", "Official Guideline"),
                "page": chunk.get("page", 1),
                "section": chunk.get("section", "General"),
                "authority": chunk.get("authority", "Government of India"),
                "source_url": chunk.get("source_url")
            }
            for chunk in context
        ]

        top_confidence = float(context[0].get("confidence", 0.90)) if context else 0.0

        try:
            async with httpx.AsyncClient(timeout=llm_config.OLLAMA_TIMEOUT) as client:
                res = await client.post(
                    f"{llm_config.OLLAMA_BASE_URL}/api/generate",
                    json={
                        "model": llm_config.OLLAMA_MODEL,
                        "prompt": f"{prompt_to_use}\n\nUser Question: {query}\nAnswer:",
                        "stream": False,
                        "options": {
                            "temperature": llm_config.TEMPERATURE,
                            "num_predict": llm_config.MAX_TOKENS
                        }
                    }
                )
                if res.status_code == 200:
                    data = res.json()
                    ans = data.get("response", "").strip()
                    if ans:
                        return {
                            "answer": ans,
                            "sources": sources,
                            "confidence": top_confidence,
                            "insufficient_evidence": False
                        }
        except Exception as e:
            logger.warning(f"Ollama LLM call notice ({e}). Using grounded context summary.")

        # Grounded fallback summary directly built from supplied context
        top_content = context[0].get("content", "")
        return {
            "answer": f"{top_content} (Source: {sources[0]['title']})",
            "sources": sources,
            "confidence": top_confidence,
            "insufficient_evidence": False
        }

llm_service = LLMService()
