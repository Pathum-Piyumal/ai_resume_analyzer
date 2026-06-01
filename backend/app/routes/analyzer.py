from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.pdf_extractor import extract_text
from app.services.nlp_processor import extract_skills
from app.services.matcher import calculate_match
from app.models.schemas import AnalysisResult

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResult)
async def analyze_resume(
    resume: UploadFile = File(...),        
    job_description: str = Form(...)       
):
   
    if not resume.filename.endswith('.pdf'):
        raise HTTPException(
            status_code=400,    
            detail="Only PDF files are accepted"
        )
    
    if not job_description.strip():
        raise HTTPException(
            status_code=400,
            detail="Job description cannot be empty"
        )

    resume_text = await extract_text(resume)
    
    if not resume_text.strip():
        raise HTTPException(
            status_code=422,   
            detail="Could not extract text from PDF. Make sure it's not a scanned image."
        )
    
    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(job_description)
    
    match_score, missing_skills = calculate_match(
        resume_text, job_description, resume_skills, jd_skills
    )

    return AnalysisResult(
        match_score=match_score,
        resume_skills=resume_skills,
        jd_skills=jd_skills,
        missing_skills=missing_skills,
        resume_text_preview=resume_text[:300]  
    )