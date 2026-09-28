from app.services.rag_service import rag_service

def test_rag_service_contract():
    result = rag_service.search(query="PM-KISAN", domain="Agriculture")
    assert isinstance(result, dict)
    assert "query" in result
    assert "results" in result
    assert "retrieval_confidence" in result
    assert "insufficient_evidence" in result
    assert isinstance(result["results"], list)
