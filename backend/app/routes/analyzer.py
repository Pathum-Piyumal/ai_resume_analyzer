from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import StreamingResponse
import asyncio
import json
from sqlmodel import Session
from app.db import get_session
from app.models.models import User, ResumeScan
from app.models.schemas import AnalysisResult
from app.services.auth_utils import get_current_user
from app.services.pdf_extractor import extract_text
from app.services.nlp_processor import extract_skills
from app.services.ai_client import analyze_resume_with_ai
from app.services.integrations import generate_integration_links

router = APIRouter(tags=["analyzer"])

@router.post("/analyze", response_model=AnalysisResult)
async def analyze_resume(
    resume: UploadFile = File(...),        
    job_description: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    # 1. Validation
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

    # Enforce maximum size constraint (5MB) and check empty file
    MAX_FILE_SIZE = 5 * 1024 * 1024
    file_size = getattr(resume, "size", None)
    if file_size is None:
        resume.file.seek(0, 2)
        file_size = resume.file.tell()
        resume.file.seek(0)

    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="File size exceeds the 5MB maximum limit."
        )
    if file_size == 0:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty."
        )

    # 2. Extract text from PDF
    resume_text = await extract_text(resume)
    
    if not resume_text.strip():
        raise HTTPException(
            status_code=422,   
            detail="Could not extract text from PDF. Make sure it's not a scanned image."
        )
    
    # 3. Simple local skills pre-parsing
    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(job_description)
    
    # 4. Call AI Generation (Gemini API with fallback)
    ai_analysis = await analyze_resume_with_ai(
        resume_text, job_description, resume_skills, jd_skills
    )
    
    # 5. Build Course & Job search platform links
    missing_skills = ai_analysis.get("missing_skills", [])
    integration_links = generate_integration_links(missing_skills)
    
    # 6. Persist scan in the database
    new_scan = ResumeScan(
        user_id=current_user.id,
        file_name=resume.filename,
        match_score=ai_analysis.get("match_score", 0.0),
        resume_text=resume_text,
        job_description=job_description,
        parsed_data=ai_analysis
    )
    db.add(new_scan)
    db.commit()
    db.refresh(new_scan)

    # 7. Format final response schema
    return AnalysisResult(
        match_score=ai_analysis.get("match_score", 0.0),
        resume_skills=ai_analysis.get("matched_skills", resume_skills),
        jd_skills=jd_skills,
        missing_skills=missing_skills,
        formatting_issues=ai_analysis.get("formatting_issues", []),
        bullet_points_improvements=ai_analysis.get("bullet_points_improvements", []),
        career_suggestions=ai_analysis.get("career_suggestions", []),
        courses=integration_links.get("courses", []),
        jobs=integration_links.get("jobs", []),
        resume_text_preview=resume_text[:300],
        job_title=ai_analysis.get("job_title") or resume.filename.replace(".pdf", "").replace("_", " ").replace("-", " ").title()
    )

@router.post("/analyze/stream")
async def analyze_resume_stream(
    resume: UploadFile = File(...),        
    job_description: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    async def event_generator():
        try:
            # Step 1: Parsing PDF
            yield json.dumps({"status": "progress", "progress": 20, "message": "Parsing resume document formatting..."}) + "\n"
            await asyncio.sleep(0.5)
            
            # Validation
            if not resume.filename.endswith('.pdf'):
                yield json.dumps({"status": "error", "message": "Only PDF files are accepted"}) + "\n"
                return
            
            if not job_description.strip():
                yield json.dumps({"status": "error", "message": "Job description cannot be empty"}) + "\n"
                return

            # Enforce maximum size constraint (5MB) and check empty file
            MAX_FILE_SIZE = 5 * 1024 * 1024
            file_size = getattr(resume, "size", None)
            if file_size is None:
                resume.file.seek(0, 2)
                file_size = resume.file.tell()
                resume.file.seek(0)

            if file_size > MAX_FILE_SIZE:
                yield json.dumps({"status": "error", "message": "File size exceeds the 5MB maximum limit."}) + "\n"
                return
            if file_size == 0:
                yield json.dumps({"status": "error", "message": "Uploaded file is empty."}) + "\n"
                return
            
            # Extract text from PDF
            resume_text = await extract_text(resume)
            if not resume_text.strip():
                yield json.dumps({"status": "error", "message": "Could not extract text from PDF. Make sure it is not a scanned image."}) + "\n"
                return

            # Step 2: Extracting Skills
            yield json.dumps({"status": "progress", "progress": 45, "message": "Extracting skills and credential entities..."}) + "\n"
            resume_skills = extract_skills(resume_text)
            jd_skills = extract_skills(job_description)
            await asyncio.sleep(0.5)

            # Step 3: Cross-referencing qualifications (AI generation)
            yield json.dumps({"status": "progress", "progress": 70, "message": "Cross-referencing job requirements with qualifications..."}) + "\n"
            ai_analysis = await analyze_resume_with_ai(
                resume_text, job_description, resume_skills, jd_skills
            )
            
            # Step 4: Compiling search links and saving scan
            yield json.dumps({"status": "progress", "progress": 90, "message": "Analyzing ATS matching compatibility..."}) + "\n"
            missing_skills = ai_analysis.get("missing_skills", [])
            integration_links = generate_integration_links(missing_skills)
            
            new_scan = ResumeScan(
                user_id=current_user.id,
                file_name=resume.filename,
                match_score=ai_analysis.get("match_score", 0.0),
                resume_text=resume_text,
                job_description=job_description,
                parsed_data=ai_analysis
            )
            db.add(new_scan)
            db.commit()
            db.refresh(new_scan)
            await asyncio.sleep(0.5)

            # Step 5: Finished
            yield json.dumps({"status": "progress", "progress": 100, "message": "Compiling final career recommendations..."}) + "\n"
            await asyncio.sleep(0.3)
            
            final_result = {
                "match_score": ai_analysis.get("match_score", 0.0),
                "resume_skills": ai_analysis.get("matched_skills", resume_skills),
                "jd_skills": jd_skills,
                "missing_skills": missing_skills,
                "formatting_issues": ai_analysis.get("formatting_issues", []),
                "bullet_points_improvements": ai_analysis.get("bullet_points_improvements", []),
                "career_suggestions": ai_analysis.get("career_suggestions", []),
                "courses": integration_links.get("courses", []),
                "jobs": integration_links.get("jobs", []),
                "resume_text_preview": resume_text[:300],
                "job_title": ai_analysis.get("job_title") or resume.filename.replace(".pdf", "").replace("_", " ").replace("-", " ").title()
            }
            yield json.dumps({"status": "completed", "result": final_result}) + "\n"
            
        except Exception as e:
            yield json.dumps({"status": "error", "message": f"Server error: {str(e)}"}) + "\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")