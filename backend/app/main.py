from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import analyzer

app = FastAPI(title="AI Resume Analyzer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyzer.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Resume AI Analyzer is Running!"}