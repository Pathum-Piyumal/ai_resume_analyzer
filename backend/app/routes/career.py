from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.db import get_session
from app.models.models import User, ResumeScan
from app.services.auth_utils import get_current_user
from app.services.ai_client import generate_career_path_with_ai, get_fallback_career_path

router = APIRouter(prefix="/career", tags=["career"])

@router.get("/path")
async def get_career_path(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Retrieve or dynamically generate a customized career progression roadmap for the user."""
    # 1. Fetch latest scan for current user
    statement = select(ResumeScan).where(ResumeScan.user_id == current_user.id).order_by(ResumeScan.scanned_at.desc())
    latest_scan = db.exec(statement).first()
    
    if not latest_scan:
        # User has no scans yet: return fallback profile path
        return get_fallback_career_path()
        
    # 2. Extract profile details
    resume_text = latest_scan.resume_text
    job_description = latest_scan.job_description
    parsed_data = latest_scan.parsed_data or {}
    
    matched_skills = parsed_data.get("matched_skills") or parsed_data.get("resume_skills") or []
    missing_skills = parsed_data.get("missing_skills") or []
    
    # 3. Call AI to generate customized career roadmap
    career_roadmap = await generate_career_path_with_ai(
        resume_text=resume_text,
        job_description=job_description,
        matched_skills=matched_skills,
        missing_skills=missing_skills
    )
    
    return career_roadmap
