from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.pdf_extractor import extract_text
from app.services.nlp_processor import extract_skills
from app.services.matcher import calculate_match
from app.models.schemas import AnalysisResult

# APIRouter is like a mini FastAPI app — groups related routes
router = APIRouter()

@router.post("/analyze", response_model=AnalysisResult)
async def analyze_resume(
    resume: UploadFile = File(...),        # File(...) = required file upload
    job_description: str = Form(...)       # Form(...) = required form field
):
    """
    Main endpoint. Accepts a PDF resume and job description text.
    Returns match score, skills found, and improvement suggestions.
    
    Why POST and not GET?
    GET is for fetching data, POST is for sending data to process.
    We're sending a file + text, so POST is correct.
    
    Why async?
    File I/O is slow. 'async' lets the server handle other requests
    while waiting for the file to be read.
    """
    
    # --- Validation ---
    # Check that the uploaded file is actually a PDF
    if not resume.filename.endswith('.pdf'):
        raise HTTPException(
            status_code=400,    # 400 = Bad Request
            detail="Only PDF files are accepted"
        )
    
    # Check that job description isn't empty
    if not job_description.strip():
        raise HTTPException(
            status_code=400,
            detail="Job description cannot be empty"
        )
    
    # --- Processing Pipeline ---
    # Step 1: Extract text from PDF
    resume_text = await extract_text(resume)
    
    # Guard against empty PDFs (scanned/image-based PDFs)
    if not resume_text.strip():
        raise HTTPException(
            status_code=422,    # 422 = Unprocessable Content
            detail="Could not extract text from PDF. Make sure it's not a scanned image."
        )
    
    # Step 2: Extract skills from both texts
    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(job_description)
    
    # Step 3: Calculate match score
    match_score, missing_skills = calculate_match(
        resume_text, job_description, resume_skills, jd_skills
    )
    
    # Step 4: Return structured response
    # FastAPI validates this against AnalysisResult schema automatically
    return AnalysisResult(
        match_score=match_score,
        resume_skills=resume_skills,
        jd_skills=jd_skills,
        missing_skills=missing_skills,
        resume_text_preview=resume_text[:300]   # First 300 chars for debugging
    )