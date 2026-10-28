import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from app.models.models import User, UserSetting
from app.services.auth_utils import get_password_hash

@pytest.fixture
def auth_header(session: Session, client: TestClient):
    # Register/create user
    user = User(email="settings_user@example.com", hashed_password=get_password_hash("Password123!"))
    session.add(user)
    session.commit()
    
    # Initialize default settings
    setting = UserSetting(user_id=user.id, theme="dark", email_notifications=True, tier="free")
    session.add(setting)
    session.commit()
    
    # Login
    login_resp = client.post("/api/auth/login", data={
        "username": "settings_user@example.com",
        "password": "Password123!"
    })
    token = login_resp.json()["access_token"]
    return user, {"Authorization": f"Bearer {token}"}

def test_get_settings_success(client: TestClient, auth_header: tuple):
    user, headers = auth_header
    response = client.get("/api/settings", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["theme"] == "dark"
    assert data["email_notifications"] is True
    assert data["tier"] == "free"

def test_update_settings_success(client: TestClient, session: Session, auth_header: tuple):
    user, headers = auth_header
    response = client.put("/api/settings", json={
        "theme": "light",
        "email_notifications": False
    }, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["theme"] == "light"
    assert data["email_notifications"] is False

    # Check db
    db_setting = session.exec(select(UserSetting).where(UserSetting.user_id == user.id)).first()
    assert db_setting.theme == "light"
    assert db_setting.email_notifications is False

def test_upgrade_to_pro_success(client: TestClient, session: Session, auth_header: tuple):
    user, headers = auth_header
    response = client.post("/api/settings/upgrade", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["tier"] == "pro"

    # Check db
    db_setting = session.exec(select(UserSetting).where(UserSetting.user_id == user.id)).first()
    assert db_setting.tier == "pro"
