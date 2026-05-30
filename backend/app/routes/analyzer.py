from fastapi import APIRouter, UploadFile, File, Form
from app.services.pdf_extractor import extract_text
from app.services.nlp_processor import extract_skills
from app.services.matcher import calculate_match

router = APIRouter()

@router.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    # 1. Extract text from PDF
    resume_text = await extract_text(resume)
    
    # 2. Extract skills from both
    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(job_description)
    
    # 3. Calculate match score
    score, missing_skills = calculate_match(resume_text, job_description, resume_skills, jd_skills)
    
    return {
        "match_score": score,
        "resume_skills": resume_skills,
        "jd_skills": jd_skills,
        "missing_skills": missing_skills,
    }