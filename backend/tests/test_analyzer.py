import pytest
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from app.models.models import User, ResumeScan
from app.services.auth_utils import get_password_hash

@pytest.fixture
def auth_header(session: Session, client: TestClient):
    # Register/create user
    user = User(email="analyzer_user@example.com", hashed_password=get_password_hash("Password123!"))
    session.add(user)
    session.commit()
    
    # Login
    login_resp = client.post("/api/auth/login", data={
        "username": "analyzer_user@example.com",
        "password": "Password123!"
    })
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_analyze_only_pdf_accepted(client: TestClient, auth_header: dict):
    # Try uploading txt file
    files = {"resume": ("test.txt", b"some dummy txt", "text/plain")}
    data = {"job_description": "We need a Python coder."}
    
    response = client.post("/api/analyze", files=files, data=data, headers=auth_header)
    assert response.status_code == 400
    assert "Only PDF files are accepted" in response.json()["detail"]

def test_analyze_empty_job_description(client: TestClient, auth_header: dict):
    files = {"resume": ("test.pdf", b"%PDF-1.4 dummy", "application/pdf")}
    data = {"job_description": "  "}
    
    response = client.post("/api/analyze", files=files, data=data, headers=auth_header)
    assert response.status_code == 400
    assert "Job description cannot be empty" in response.json()["detail"]

def test_analyze_max_file_size_exceeded(client: TestClient, auth_header: dict):
    # Upload large payload (6MB)
    large_pdf_data = b"%PDF-1.4 " + b"x" * (6 * 1024 * 1024)
    files = {"resume": ("large.pdf", large_pdf_data, "application/pdf")}
    data = {"job_description": "Senior React Architect"}
    
    response = client.post("/api/analyze", files=files, data=data, headers=auth_header)
    assert response.status_code == 413
    assert "exceeds the 5MB maximum limit" in response.json()["detail"]

def test_analyze_empty_file_fails(client: TestClient, auth_header: dict):
    files = {"resume": ("empty.pdf", b"", "application/pdf")}
    data = {"job_description": "Senior React Architect"}
    
    response = client.post("/api/analyze", files=files, data=data, headers=auth_header)
    assert response.status_code == 400
    assert "file is empty" in response.json()["detail"]

@patch("app.routes.analyzer.extract_text", new_callable=AsyncMock)
@patch("app.routes.analyzer.analyze_resume_with_ai", new_callable=AsyncMock)
def test_analyze_resume_success(
    mock_ai,
    mock_extract,
    client: TestClient,
    session: Session,
    auth_header: dict
):
    mock_extract.return_value = "Python Developer with 5 years experience. Skills: Python, Docker, Git."
    mock_ai.return_value = {
        "match_score": 88.5,
        "matched_skills": ["python", "docker", "git"],
        "missing_skills": ["kubernetes", "aws"],
        "formatting_issues": ["Avoid custom symbols"],
        "bullet_points_improvements": [
            {"before": "Did coding.", "after": "Architected modules."}
        ],
        "career_suggestions": ["Learn AWS Core"]
    }
    
    files = {"resume": ("resume.pdf", b"%PDF-1.4 valid", "application/pdf")}
    data = {"job_description": "We need a Python coder with Kubernetes experience."}
    
    response = client.post("/api/analyze", files=files, data=data, headers=auth_header)
    assert response.status_code == 200
    
    res_data = response.json()
    assert res_data["match_score"] == 88.5
    assert "python" in res_data["resume_skills"]
    assert "kubernetes" in res_data["missing_skills"]
    
    # Check that database has saved the scan
    scan = session.exec(select(ResumeScan)).first()
    assert scan is not None
    assert scan.file_name == "resume.pdf"
    assert scan.match_score == 88.5
    assert scan.parsed_data["match_score"] == 88.5

@patch("app.routes.analyzer.extract_text", new_callable=AsyncMock)
@patch("app.routes.analyzer.analyze_resume_with_ai", new_callable=AsyncMock)
def test_analyze_resume_stream_success(
    mock_ai,
    mock_extract,
    client: TestClient,
    session: Session,
    auth_header: dict
):
    mock_extract.return_value = "Frontend UI Developer"
    mock_ai.return_value = {
        "match_score": 90.0,
        "matched_skills": ["react"],
        "missing_skills": ["typescript"],
        "formatting_issues": [],
        "bullet_points_improvements": [],
        "career_suggestions": []
    }
    
    files = {"resume": ("resume.pdf", b"%PDF-1.4 stream", "application/pdf")}
    data = {"job_description": "React Developer"}
    
    response = client.post("/api/analyze/stream", files=files, data=data, headers=auth_header)
    assert response.status_code == 200
    assert "text/event-stream" in response.headers["content-type"]
    
    # Read streaming chunks
    lines = response.text.split("\n")
    events = [line for line in lines if line.strip()]
    
    assert len(events) >= 3
    # Check progress chunks
    assert "progress" in events[0]
    # Check final completed event containing result
    assert "completed" in events[-1]
