import pytest
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from app.models.models import User, ResumeScan, UserSetting, PasswordResetToken

@patch("app.routes.analyzer.extract_text", new_callable=AsyncMock)
@patch("app.routes.analyzer.analyze_resume_with_ai", new_callable=AsyncMock)
@patch("app.routes.career.generate_career_path_with_ai", new_callable=AsyncMock)
def test_full_user_acceptance_workflow(
    mock_career_ai,
    mock_analyze_ai,
    mock_extract_text,
    client: TestClient,
    session: Session
):
    # Setup Mocks
    mock_extract_text.return_value = "Experienced Software Engineer. Skills: Python, React."
    mock_analyze_ai.return_value = {
        "match_score": 85.0,
        "matched_skills": ["python", "react"],
        "missing_skills": ["docker"],
        "formatting_issues": ["Avoid triple columns"],
        "bullet_points_improvements": [],
        "career_suggestions": []
    }
    mock_career_ai.return_value = {
        "career_steps": [
            {"id": 1, "role": "Junior Dev", "status": "completed", "salary": "70k", "duration": "1 yr", "skills": []},
            {"id": 2, "role": "Senior Dev", "status": "next", "salary": "130k", "duration": "3 yrs", "skills": []}
        ],
        "recommended_courses": [],
        "guided_projects": []
    }

    # 1. Register a new user
    reg_resp = client.post("/api/auth/register", json={
        "email": "e2e_user@example.com",
        "password": "E2ePassword123!"
    })
    assert reg_resp.status_code == 201
    
    # 2. Login to get session token
    login_resp = client.post("/api/auth/login", data={
        "username": "e2e_user@example.com",
        "password": "E2ePassword123!"
    })
    assert login_resp.status_code == 200
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 3. Analyze a resume PDF
    files = {"resume": ("resume.pdf", b"%PDF-1.4 dummy contents", "application/pdf")}
    data = {"job_description": "We need a Python developer who knows React."}
    analyze_resp = client.post("/api/analyze", files=files, data=data, headers=headers)
    assert analyze_resp.status_code == 200
    assert analyze_resp.json()["match_score"] == 85.0
    
    # 4. Fetch the dynamic Career Roadmap and verify caching
    career_resp1 = client.get("/api/career/path", headers=headers)
    assert career_resp1.status_code == 200
    assert len(career_resp1.json()["career_steps"]) == 2
    
    # Verify mock was called once
    assert mock_career_ai.call_count == 1
    
    # Second request to check cache loading (caching check)
    career_resp2 = client.get("/api/career/path", headers=headers)
    assert career_resp2.status_code == 200
    # The mock call count remains 1 due to database caching
    assert mock_career_ai.call_count == 1
    
    # 5. Check user settings (default is free tier)
    settings_resp = client.get("/api/settings", headers=headers)
    assert settings_resp.status_code == 200
    assert settings_resp.json()["tier"] == "free"
    
    # 6. Upgrade user to Pro plan
    upgrade_resp = client.post("/api/settings/upgrade", headers=headers)
    assert upgrade_resp.status_code == 200
    assert upgrade_resp.json()["tier"] == "pro"
    
    # Confirm settings now reflect Pro tier
    settings_resp2 = client.get("/api/settings", headers=headers)
    assert settings_resp2.json()["tier"] == "pro"
    
    # 7. Request forgot password link
    forgot_resp = client.post("/api/auth/forgot-password", json={"email": "e2e_user@example.com"})
    assert forgot_resp.status_code == 200
    
    # Get the token directly from database
    token_rec = session.exec(select(PasswordResetToken).where(PasswordResetToken.email == "e2e_user@example.com")).first()
    assert token_rec is not None
    
    # 8. Reset password using the retrieved token
    reset_resp = client.post("/api/auth/reset-password", json={
        "token": token_rec.token,
        "password": "NewE2ePassword123!"
    })
    assert reset_resp.status_code == 200
    
    # 9. Verify login succeeds with the new password
    login_resp2 = client.post("/api/auth/login", data={
        "username": "e2e_user@example.com",
        "password": "NewE2ePassword123!"
    })
    assert login_resp2.status_code == 200
    assert "access_token" in login_resp2.json()
