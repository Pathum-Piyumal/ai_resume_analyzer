from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import analyzer

# Create the FastAPI application instance
app = FastAPI(
    title="AI Resume Analyzer API",
    description="Upload a resume PDF and job description to get a match score",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],      
    allow_headers=["*"],      
)

app.include_router(analyzer.router, prefix="/api")

@app.get("/")
def root():
    return {
        "status": "running",
        "message": "AI Resume Analyzer API",
        "docs": "/docs"
    }