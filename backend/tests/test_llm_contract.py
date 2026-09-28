import asyncio
import pytest
from app.services.llm_service import llm_service

def test_llm_service_contract_with_manual_context():
    manual_context = [
        {
            "content": "PM-KISAN provides income support of ₹6,000 per year for farmer families.",
            "title": "PM-KISAN Test Document",
            "page": 1,
            "section": "Sec. 4",
            "authority": "Ministry of Agriculture",
            "confidence": 0.95
        }
    ]

    result = asyncio.run(llm_service.generate(
        query="What is PM-KISAN?",
        context=manual_context
    ))

    assert isinstance(result, dict)
    assert "answer" in result
    assert "sources" in result
    assert "confidence" in result
    assert "insufficient_evidence" in result
    assert len(result["sources"]) > 0

