from fastapi import APIRouter, UploadFile, File, Form, Response
from app.services.stt_service import stt_service
from app.services.tts_service import tts_service
from app.services.rag_service import rag_service
from app.services.llm_service import llm_service
from app.services.citation_service import citation_service

router = APIRouter()

@router.post("/voice")
async def voice_chat(file: UploadFile = File(...), language: str = Form("en")):
    audio_bytes = await file.read()
    
    # 1. Speech to text
    query_text, detected_lang = stt_service.transcribe_audio(audio_bytes, language=language)

    # 2. RAG Context Retrieval using standard contract
    rag_res = rag_service.search(query=query_text, language=detected_lang)
    context_chunks = rag_res.get("results", [])
    score = rag_res.get("retrieval_confidence", 0.0)
    citations = citation_service.build_citations(context_chunks)

    # 3. LLM Response Generation (Gemini / Ollama fallback)
    llm_res = await llm_service.generate(
        query=query_text,
        context=context_chunks,
        original_language=detected_lang
    )
    answer_text = llm_res.get("answer", "")

    # 4. Text to speech audio synthesis using edge-tts
    audio_output = await tts_service.synthesize_speech_async(answer_text, lang=detected_lang)

    return {
        "query": query_text,
        "answer": answer_text,
        "language": detected_lang,
        "sources": [c.model_dump() for c in citations] if citations else llm_res.get("sources", []),
        "confidence": round(llm_res.get("confidence", score), 2),
        "has_audio": bool(audio_output)
    }

@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...), language: str = Form(None)):
    audio_bytes = await file.read()
    text, detected_lang = stt_service.transcribe_audio(audio_bytes, language=language)
    return {"text": text, "language": detected_lang}

@router.post("/synthesize")
async def synthesize_speech(text: str = Form(...), language: str = Form("en")):
    audio_bytes = await tts_service.synthesize_speech_async(text, lang=language)
    return Response(content=audio_bytes, media_type="audio/mpeg")


