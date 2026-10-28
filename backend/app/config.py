"""Environment settings shared by the application and deployment checks."""
import os
from urllib.parse import urlsplit


def is_production():
    return os.getenv("APP_ENV", "production" if os.getenv("RENDER") else "development").lower() == "production"


def frontend_origin():
    return os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")


def validate_production_config():
    if not is_production():
        return
    if len(os.getenv("JWT_SECRET_KEY", "")) < 32:
        raise RuntimeError("Production requires JWT_SECRET_KEY with at least 32 characters")
    if not os.getenv("DATABASE_URL", "").startswith(("postgres://", "postgresql://")):
        raise RuntimeError("Production requires a PostgreSQL DATABASE_URL")
    origin = urlsplit(frontend_origin())
    if origin.scheme != "https" or not origin.hostname or origin.path:
        raise RuntimeError("Production requires an HTTPS FRONTEND_URL origin")
