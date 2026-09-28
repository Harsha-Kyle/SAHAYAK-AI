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

    # 1. Detect language if not provided
    detected_lang = request.language or language_service.detect_language(request.message)

    # 2. Retrieve official RAG context using standard search contract
    rag_result = rag_service.search(query=request.message, language=detected_lang)
    context_chunks = rag_result.get("results", [])
    score = rag_result.get("retrieval_confidence", 0.0)

    # 3. Build structured document citations
    citations = citation_service.build_citations(context_chunks)

    # 4. Generate grounded LLM response using Gemini API / Ollama
    result = await llm_service.generate(
        query=request.message,
        context=context_chunks,
        original_language=detected_lang
    )

    return ChatResponse(
        answer=result.get("answer", ""),
        language=detected_lang,
        sources=citations if citations else result.get("sources", []),
        confidence=round(result.get("confidence", score), 2),
        session_id=request.session_id or "default_session"
    )


