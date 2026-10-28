import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from app.models.models import User, PasswordResetToken
from app.services.auth_utils import get_password_hash

def test_register_user_success(client: TestClient, session: Session):
    response = client.post("/api/auth/register", json={
        "email": "new_user@example.com",
        "password": "Password123!"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "new_user@example.com"
    assert data["role"] == "job_seeker"
    assert "id" in data

    # Check database
    user = session.exec(select(User).where(User.email == "new_user@example.com")).first()
    assert user is not None
    assert user.role == "job_seeker"

def test_register_duplicate_user(client: TestClient, session: Session):
    # Register first time
    client.post("/api/auth/register", json={
        "email": "dup@example.com",
        "password": "Password123!"
    })
    
    # Register second time
    response = client.post("/api/auth/register", json={
        "email": "dup@example.com",
        "password": "Password123!"
    })
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]

def test_login_user_success(client: TestClient, session: Session):
    # Create user
    user = User(email="login@example.com", hashed_password=get_password_hash("Password123!"))
    session.add(user)
    session.commit()
    
    # Login
    response = client.post("/api/auth/login", data={
        "username": "login@example.com",
        "password": "Password123!"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "job_seeker"

def test_login_user_invalid_credentials(client: TestClient, session: Session):
    response = client.post("/api/auth/login", data={
        "username": "wrong@example.com",
        "password": "Password123!"
    })
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]

def test_get_me_success(client: TestClient, session: Session):
    # Create user
    user = User(email="me@example.com", hashed_password=get_password_hash("Password123!"))
    session.add(user)
    session.commit()
    
    # Login to get token
    login_resp = client.post("/api/auth/login", data={
        "username": "me@example.com",
        "password": "Password123!"
    })
    token = login_resp.json()["access_token"]
    
    # Call me
    response = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["email"] == "me@example.com"

def test_forgot_password_success(client: TestClient, session: Session):
    user = User(email="forgot@example.com", hashed_password=get_password_hash("Password123!"))
    session.add(user)
    session.commit()
    
    response = client.post("/api/auth/forgot-password", json={"email": "forgot@example.com"})
    assert response.status_code == 200
    assert "Password reset link has been sent." in response.json()["message"]
    
    # Check that reset token was saved
    token_rec = session.exec(select(PasswordResetToken).where(PasswordResetToken.email == "forgot@example.com")).first()
    assert token_rec is not None
    assert len(token_rec.token) > 20

def test_forgot_password_not_found(client: TestClient):
    response = client.post("/api/auth/forgot-password", json={"email": "missing@example.com"})
    assert response.status_code == 404
    assert "No account found" in response.json()["detail"]

def test_reset_password_success(client: TestClient, session: Session):
    user = User(email="reset@example.com", hashed_password=get_password_hash("Password123!"))
    session.add(user)
    session.commit()
    
    # Request token
    client.post("/api/auth/forgot-password", json={"email": "reset@example.com"})
    token_rec = session.exec(select(PasswordResetToken).where(PasswordResetToken.email == "reset@example.com")).first()
    
    # Reset password
    response = client.post("/api/auth/reset-password", json={
        "token": token_rec.token,
        "password": "NewPassword123!"
    })
    assert response.status_code == 200
    assert "Password has been reset" in response.json()["message"]
    
    # Verify login works with new password
    login_resp = client.post("/api/auth/login", data={
        "username": "reset@example.com",
        "password": "NewPassword123!"
    })
    assert login_resp.status_code == 200
