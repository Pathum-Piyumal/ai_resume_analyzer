import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from app.models.models import User, ResumeScan, SavedJob
from app.services.auth_utils import get_password_hash

@pytest.fixture
def auth_context(session: Session, client: TestClient):
    # Register/create user
    user = User(email="history_user@example.com", hashed_password=get_password_hash("Password123!"))
    session.add(user)
    session.commit()
    
    # Login
    login_resp = client.post("/api/auth/login", data={
        "username": "history_user@example.com",
        "password": "Password123!"
    })
    token = login_resp.json()["access_token"]
    return user, {"Authorization": f"Bearer {token}"}

def test_get_scan_history_empty(client: TestClient, auth_context: tuple):
    user, headers = auth_context
    response = client.get("/api/history", headers=headers)
    assert response.status_code == 200
    assert response.json() == []

def test_get_scan_history_with_records(client: TestClient, session: Session, auth_context: tuple):
    user, headers = auth_context
    
    # Seed a scan record
    scan = ResumeScan(
        user_id=user.id,
        file_name="my_cv.pdf",
        match_score=82.0,
        resume_text="Hello cv",
        job_description="Need cv",
        parsed_data={"matched_skills": ["python"], "missing_skills": ["aws"]}
    )
    session.add(scan)
    session.commit()
    
    response = client.get("/api/history", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["file_name"] == "my_cv.pdf"
    assert data[0]["match_score"] == 82.0

def test_get_scan_detail_not_found(client: TestClient, auth_context: tuple):
    user, headers = auth_context
    response = client.get("/api/history/9999", headers=headers)
    assert response.status_code == 404

def test_get_scan_detail_success(client: TestClient, session: Session, auth_context: tuple):
    user, headers = auth_context
    scan = ResumeScan(
        user_id=user.id,
        file_name="my_cv.pdf",
        match_score=82.0,
        resume_text="Hello cv",
        job_description="Need cv",
        parsed_data={"matched_skills": ["python"], "missing_skills": ["aws"]}
    )
    session.add(scan)
    session.commit()
    
    response = client.get(f"/api/history/{scan.id}", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["file_name"] == "my_cv.pdf"
    assert data["resume_text"] == "Hello cv"

def test_delete_scan_success(client: TestClient, session: Session, auth_context: tuple):
    user, headers = auth_context
    scan = ResumeScan(
        user_id=user.id,
        file_name="my_cv.pdf",
        match_score=82.0,
        resume_text="Hello cv",
        job_description="Need cv",
        parsed_data={}
    )
    session.add(scan)
    session.commit()
    
    response = client.delete(f"/api/history/{scan.id}", headers=headers)
    assert response.status_code == 200
    assert "deleted successfully" in response.json()["message"]
    
    # Check db
    db_scan = session.exec(select(ResumeScan).where(ResumeScan.id == scan.id)).first()
    assert db_scan is None

def test_get_dashboard_stats(client: TestClient, session: Session, auth_context: tuple):
    user, headers = auth_context
    
    # Add scans
    scan1 = ResumeScan(
        user_id=user.id,
        file_name="cv1.pdf",
        match_score=70.0,
        resume_text="t1",
        job_description="j1",
        parsed_data={"resume_skills": ["python"], "missing_skills": ["aws"]}
    )
    scan2 = ResumeScan(
        user_id=user.id,
        file_name="cv2.pdf",
        match_score=80.0,
        resume_text="t2",
        job_description="j2",
        parsed_data={"resume_skills": ["python", "docker"], "missing_skills": ["kubernetes"]}
    )
    session.add(scan1)
    session.add(scan2)
    
    # Add saved jobs
    job = SavedJob(user_id=user.id, title="Dev", company="Scale", status="saved")
    session.add(job)
    session.commit()
    
    response = client.get("/api/history/stats", headers=headers)
    assert response.status_code == 200
    stats = response.json()
    
    assert stats["total_scans"] == 2
    assert stats["avg_score"] == 75.0
    assert stats["total_skills_matched"] == 2  # unique: python, docker
    assert stats["skills_gap"]["top_strengths"] == ["python", "docker"]
    assert stats["pipeline"]["saved"] == 1
