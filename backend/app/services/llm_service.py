"""
SAHAYAK AI — LLM SERVICE (PHASE 4 COMPLETE)
Allocated to: Developer B (Me)
Receives structured context from RAGService (or manual test context) and generates grounded answers via Gemini API or Ollama.
"""

import logging
import httpx
from typing import List, Dict, Any, Optional
from app.core.llm_config import llm_config

logger = logging.getLogger("sahayak.llm")

REFUSAL_MESSAGE = "I could not find sufficient verified information in the official Sahayak AI knowledge base."

# Language map for precise prompt instructions
LANGUAGE_NAMES = {
    "en": "English",
    "hi": "Hindi (हिंदी)",
    "ta": "Tamil (தமிழ்)",
    "te": "Telugu (తెలుగు)",
    "kn": "Kannada (கன்னட / ಕನ್ನಡ)",
    "mr": "Marathi (मराठी)",
    "bn": "Bengali (বাংলা)",
    "gu": "Gujarati (ગુજરાતી)",
    "ml": "Malayalam (மலையாளம் / മലയാളം)",
    "pa": "Punjabi (ਪੰਜਾਬੀ)",
    "or": "Odia (ଓଡ଼ିଆ)"
}

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
        Supports Gemini API as primary, with Ollama and context summary fallbacks.
        """
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

        target_lang_name = LANGUAGE_NAMES.get(original_language.lower(), original_language)

        default_system_prompt = (
            "You are Sahayak AI, an official multilingual rural governance assistant for farmers and cooperative members in India. "
            "Your answer MUST be strictly grounded in the official government context provided below. "
            "DO NOT invent government rules, scheme amounts, phone numbers, or dates.\n"
            f"CRITICAL INSTRUCTION: You MUST respond FULLY in the user's language: {target_lang_name}.\n\n"
            f"OFFICIAL CONTEXT:\n{context_text}"
        )

        prompt_to_use = system_prompt or default_system_prompt

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

        # Attempt 1: Gemini API (Primary)
        if llm_config.GEMINI_API_KEY:
            try:
                import google.generativeai as genai
                genai.configure(api_key=llm_config.GEMINI_API_KEY)
                model = genai.GenerativeModel(
                    model_name=llm_config.GEMINI_MODEL,
                    generation_config={
                        "temperature": llm_config.TEMPERATURE,
                        "max_output_tokens": llm_config.MAX_TOKENS,
                    }
                )
                full_prompt = f"{prompt_to_use}\n\nUser Question ({target_lang_name}): {query}\nAnswer in {target_lang_name}:"
                response = model.generate_content(full_prompt)
                if response and response.text:
                    return {
                        "answer": response.text.strip(),
                        "sources": sources,
                        "confidence": top_confidence,
                        "insufficient_evidence": False,
                        "engine": "gemini"
                    }
            except Exception as e:
                logger.warning(f"Gemini API call failed ({e}). Attempting Ollama fallback.")

        # Attempt 2: Ollama (Fallback)
        try:
            async with httpx.AsyncClient(timeout=llm_config.OLLAMA_TIMEOUT) as client:
                res = await client.post(
                    f"{llm_config.OLLAMA_BASE_URL}/api/generate",
                    json={
                        "model": llm_config.OLLAMA_MODEL,
                        "prompt": f"{prompt_to_use}\n\nUser Question ({target_lang_name}): {query}\nAnswer in {target_lang_name}:",
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
                            "insufficient_evidence": False,
                            "engine": "ollama"
                        }
        except Exception as e:
            logger.warning(f"Ollama LLM call notice ({e}). Using grounded context summary.")

        # Attempt 3: Grounded context summary fallback
        top_content = context[0].get("content", "")
        return {
            "answer": f"{top_content} (Source: {sources[0]['title']})",
            "sources": sources,
            "confidence": top_confidence,
            "insufficient_evidence": False,
            "engine": "context_fallback"
        }

llm_service = LLMService()

