from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.db import init_db
from app.routes import analyzer, auth, jobs, history, settings, admin, career, webhooks

@asynccontextmanager
async def lifespan(app: FastAPI):
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
frontend_url = os.getenv("FRONTEND_URL")
origins = [
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],      
    allow_headers=["*"],      
)

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