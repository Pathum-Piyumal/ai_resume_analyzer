import pytest
import os
from typing import Generator
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.pool import StaticPool

os.environ["APP_ENV"] = "testing"
os.environ["DATABASE_URL"] = "sqlite://"

from app.main import app
from app.db import get_session
# Ensure all models are registered with SQLModel
from app.models.models import User, UserSetting, SavedJob, ResumeScan, PasswordResetToken

TEST_DATABASE_URL = "sqlite://"

@pytest.fixture(autouse=True)
def disable_external_services(monkeypatch):
    from app.security import SecurityMiddleware
    monkeypatch.setattr(SecurityMiddleware, "limits", {})
    monkeypatch.setattr("app.routes.auth.send_reset_email", lambda *args: None)

@pytest.fixture(name="engine")
def engine_fixture():
    engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False}, poolclass=StaticPool)
    SQLModel.metadata.create_all(engine)
    yield engine
    engine.dispose()

@pytest.fixture(name="session")
def session_fixture(engine) -> Generator[Session, None, None]:
    connection = engine.connect()
    transaction = connection.begin()
    
    # Bind the session to the connection/transaction
    session = Session(bind=connection)
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture(name="client")
def client_fixture(session: Session) -> Generator[TestClient, None, None]:
    def get_session_override():
        return session
    
    app.dependency_overrides[get_session] = get_session_override
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()
