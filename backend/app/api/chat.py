from fastapi import APIRouter, HTTPException
from app.models.conversation import ChatRequest, ChatResponse
from app.services.rag_service import rag_service
from app.services.llm_service import llm_service
from app.services.citation_service import citation_service
from app.services.language_service import language_service

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message query cannot be empty.")

    # 1. Detect language if default
    detected_lang = request.language or language_service.detect_language(request.message)

    # 2. Retrieve official RAG context chunks
    context_chunks, score = rag_service.retrieve_context(request.message)

    # 3. Build structured document citations
    citations = citation_service.build_citations(context_chunks)

    # 4. Generate grounded LLM response (or refusal if context insufficient)
    answer = await llm_service.generate_answer(
        query=request.message,
        context_chunks=context_chunks,
        confidence_score=score,
        language=detected_lang
    )

    return ChatResponse(
        answer=answer,
        language=detected_lang,
        sources=citations,
        confidence=round(score, 2),
        session_id=request.session_id or "default_session"
    )
