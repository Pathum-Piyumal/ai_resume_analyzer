from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.db import init_db
from app.config import frontend_origin, is_production, validate_production_config
from app.routes import analyzer, auth, jobs, history, settings, admin, career, webhooks

@asynccontextmanager
async def lifespan(app: FastAPI):
    validate_production_config()
    # Initialize the database and create tables
    init_db()
    yield
    # Cleanup actions (if any) go here

# Create the FastAPI application instance
app = FastAPI(
    title="AI Resume Analyzer API",
    description="Upload a resume PDF and job description to get a match score",
    version="1.0.0",
    lifespan=lifespan
)

import os

# CORS Configuration - allow frontend origins
frontend_url = frontend_origin()
origins = [] if is_production() else [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
if frontend_url:
    origins.append(frontend_url.rstrip('/'))

from app.security import SecurityMiddleware
app.add_middleware(SecurityMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],      
    allow_headers=["*"],      
)

@app.get("/health/live", include_in_schema=False)
def liveness():
    return {"status": "ok"}

@app.get("/health/ready", include_in_schema=False)
def readiness():
    from sqlalchemy import text
    from fastapi.responses import JSONResponse
    from app.db import engine
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"status": "ready"}
    except Exception:
        return JSONResponse({"status": "unavailable"}, status_code=503)

# Register routers under /api prefix
app.include_router(analyzer.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(jobs.router, prefix="/api")
app.include_router(history.router, prefix="/api")
app.include_router(settings.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(career.router, prefix="/api")
app.include_router(webhooks.router, prefix="/api")

@app.get("/")
def root():
    return {
        "status": "running",
        "message": "AI Resume Analyzer API",
        "docs": "/docs"
    }
