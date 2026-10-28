import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from app.config import validate_production_config
from app.security import SecurityMiddleware
from app.models.models import User, UserSetting
from app.services.auth_utils import get_password_hash


def test_mock_google_identity_is_rejected(client):
    response = client.post('/api/auth/google', json={'id_token': 'mock_google_token:admin@example.com:fake'})
    assert response.status_code == 401


@pytest.mark.parametrize('password', ['short', 'é' * 40])
def test_registration_rejects_invalid_password(client, password):
    response = client.post('/api/auth/register', json={'email': 'valid@example.com', 'password': password})
    assert response.status_code == 422


def test_registration_stores_name_and_never_grants_admin(client):
    response = client.post('/api/auth/register', json={
        'email': ' Name@Example.com ', 'password': 'Password123!',
        'full_name': 'Test Person', 'role': 'admin',
    })
    assert response.status_code == 201
    assert response.json()['role'] == 'job_seeker'
    login = client.post('/api/auth/login', data={'username': 'name@example.com', 'password': 'Password123!'}).json()
    headers = {'Authorization': f"Bearer {login['access_token']}"}
    settings = client.get('/api/settings', headers=headers).json()
    assert (settings['first_name'], settings['last_name']) == ('Test', 'Person')
    assert client.get('/api/admin/stats', headers=headers).status_code == 403
    assert client.put('/api/settings', headers=headers, json={
        'theme': 'dark', 'email_notifications': True, 'tier': 'pro',
    }).status_code == 403


def test_reset_response_does_not_disclose_account_existence_or_token(client, session):
    session.add(User(email='reset-check@example.com', hashed_password=get_password_hash('Password123!')))
    session.commit()
    existing = client.post('/api/auth/forgot-password', json={'email': 'reset-check@example.com'})
    missing = client.post('/api/auth/forgot-password', json={'email': 'absent@example.com'})
    assert existing.status_code == missing.status_code == 200
    assert existing.json() == missing.json()
    assert 'token' not in existing.json()


def test_production_requires_secret_and_postgres(monkeypatch):
    monkeypatch.setenv('APP_ENV', 'production')
    monkeypatch.delenv('JWT_SECRET_KEY', raising=False)
    with pytest.raises(RuntimeError, match='JWT_SECRET_KEY'):
        validate_production_config()
    monkeypatch.setenv('JWT_SECRET_KEY', 'a' * 48)
    monkeypatch.setenv('DATABASE_URL', 'sqlite://')
    with pytest.raises(RuntimeError, match='PostgreSQL'):
        validate_production_config()
    monkeypatch.setenv('DATABASE_URL', 'postgresql://example/db')
    monkeypatch.setenv('FRONTEND_URL', 'https://example.com')
    validate_production_config()


def test_production_password_recovery_requires_delivery(client, monkeypatch):
    monkeypatch.setenv('APP_ENV', 'production')
    monkeypatch.setattr('app.services.email_service.email_delivery_configured', lambda: False)
    response = client.post('/api/auth/forgot-password', json={'email': 'user@example.com'})
    assert response.status_code == 503
    assert 'token' not in response.json()


def test_authentication_requests_are_throttled(monkeypatch):
    monkeypatch.setattr(SecurityMiddleware, 'limits', {'/api/auth/login': (2, 60)})
    test_app = FastAPI()
    test_app.add_middleware(SecurityMiddleware)

    @test_app.post('/api/auth/login')
    def login():
        return {'ok': True}

    with TestClient(test_app) as client:
        assert client.post('/api/auth/login').status_code == 200
        assert client.post('/api/auth/login').status_code == 200
        response = client.post('/api/auth/login')
        assert response.status_code == 429
        assert int(response.headers['Retry-After']) > 0
        assert response.headers['Cache-Control'] == 'no-store'


def test_unconfigured_checkout_cannot_upgrade_user(client, session, monkeypatch):
    monkeypatch.delenv('STRIPE_SECRET_KEY', raising=False)
    client.post('/api/auth/register', json={'email': 'checkout@example.com', 'password': 'Password123!'})
    token = client.post('/api/auth/login', data={'username': 'checkout@example.com', 'password': 'Password123!'}).json()['access_token']
    headers = {'Authorization': f'Bearer {token}'}
    assert client.post('/api/settings/upgrade/checkout-session', headers=headers).status_code == 503
    assert client.get('/api/settings', headers=headers).json()['tier'] == 'free'
