import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["app"] == "Sahayak AI Backend"
    assert "database" in data
    assert data["database"]["status"] == "connected"

def test_schemes_endpoint():
    response = client.get("/api/schemes")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 4

def test_chat_fallback():
    response = client.post("/api/chat", json={"message": "Am I eligible for PM-KISAN money?", "language": "en"})
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert data["confidence"] > 0.5
