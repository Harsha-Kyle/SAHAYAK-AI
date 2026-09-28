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

    # 2. RAG Context Retrieval
    context_chunks, score = rag_service.retrieve_context(query_text)
    citations = citation_service.build_citations(context_chunks)

    # 3. LLM Response Generation
    answer_text = await llm_service.generate_answer(query_text, context_chunks, score, language=detected_lang)

    # 4. Text to speech audio synthesis
    audio_output = tts_service.synthesize_speech(answer_text, lang=detected_lang)

    return {
        "query": query_text,
        "answer": answer_text,
        "language": detected_lang,
        "sources": [c.model_dump() for c in citations],
        "confidence": round(score, 2),
        "has_audio": bool(audio_output)
    }

@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...), language: str = Form(None)):
    audio_bytes = await file.read()
    text, detected_lang = stt_service.transcribe_audio(audio_bytes, language=language)
    return {"text": text, "language": detected_lang}

@router.post("/synthesize")
async def synthesize_speech(text: str = Form(...), language: str = Form("en")):
    audio_bytes = tts_service.synthesize_speech(text, lang=language)
    return Response(content=audio_bytes, media_type="audio/mpeg")
