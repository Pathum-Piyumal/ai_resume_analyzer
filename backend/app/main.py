from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import analyzer

# Create the FastAPI application instance
app = FastAPI(
    title="AI Resume Analyzer API",
    description="Upload a resume PDF and job description to get a match score",
    version="1.0.0"
)

# CORS = Cross-Origin Resource Sharing
# Without this, your browser BLOCKS React (port 5173) from calling
# the API (port 8000) — they're different "origins"
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Only allow our React dev server
    allow_credentials=True,
    allow_methods=["*"],      # Allow GET, POST, PUT, DELETE etc.
    allow_headers=["*"],      # Allow all headers
)

# Register the analyzer routes under the /api prefix
# So /analyze becomes /api/analyze
app.include_router(analyzer.router, prefix="/api")

# Health check endpoint — always useful to verify the server is running
@app.get("/")
def root():
    return {
        "status": "running",
        "message": "AI Resume Analyzer API",
        "docs": "/docs"
    }