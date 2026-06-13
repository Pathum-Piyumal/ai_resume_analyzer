from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.db import get_session
from app.models.models import User, ResumeScan, SavedJob
from app.services.auth_utils import get_current_user

router = APIRouter(prefix="/history", tags=["history"])

class ScanSummaryResponse(BaseModel):
    id: int
    file_name: str
    match_score: float
    scanned_at: datetime
    
    class Config:
        from_attributes = True

class ScanDetailResponse(BaseModel):
    id: int
    file_name: str
    match_score: float
    resume_text: str
    job_description: str
    parsed_data: Dict[str, Any]
    scanned_at: datetime
    
    class Config:
        from_attributes = True

@router.get("", response_model=List[ScanSummaryResponse])
def get_scan_history(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_session)
):
    """Retrieve all past scan summaries for the logged-in user."""
    statement = select(ResumeScan).where(ResumeScan.user_id == current_user.id).order_by(ResumeScan.scanned_at.desc())
    return db.exec(statement).all()

class StatsResponse(BaseModel):
    total_scans: int
    avg_score: float
    total_skills_matched: int
    match_history: List[Dict[str, Any]]
    skills_gap: Dict[str, Any]
    pipeline: Dict[str, int]

@router.get("/stats", response_model=StatsResponse)
def get_user_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Retrieve statistical aggregates for the user's dashboard."""
    # 1. Fetch all scans for the user
    scans_statement = select(ResumeScan).where(ResumeScan.user_id == current_user.id).order_by(ResumeScan.scanned_at.asc())
    scans = db.exec(scans_statement).all()
    
    total_scans = len(scans)
    
    # Calculate average score
    avg_score = 0.0
    if total_scans > 0:
        avg_score = round(sum(s.match_score for s in scans) / total_scans, 2)
        
    # Match history timeline
    match_history = []
    all_matched_skills = set()
    all_missing_skills_counts = {}
    all_matched_skills_counts = {}
    
    for s in scans:
        match_history.append({
            "id": s.id,
            "scanned_at": s.scanned_at.isoformat(),
            "match_score": s.match_score,
            "file_name": s.file_name
        })
        
        # Aggregate skills from parsed_data
        parsed = s.parsed_data or {}
        matched = parsed.get("matched_skills", [])
        missing = parsed.get("missing_skills", [])
        
        for m in matched:
            normalized = m.lower().strip()
            all_matched_skills.add(normalized)
            all_matched_skills_counts[normalized] = all_matched_skills_counts.get(normalized, 0) + 1
            
        for m in missing:
            normalized = m.lower().strip()
            all_missing_skills_counts[normalized] = all_missing_skills_counts.get(normalized, 0) + 1
            
    total_skills_matched = len(all_matched_skills)
    
    # Sort skills by frequency to find top strengths/gaps
    top_matched = sorted(all_matched_skills_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    top_missing = sorted(all_missing_skills_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    
    skills_gap = {
        "top_strengths": [item[0] for item in top_matched],
        "top_gaps": [item[0] for item in top_missing]
    }
    
    # 2. Fetch job pipeline status counts
    jobs_statement = select(SavedJob).where(SavedJob.user_id == current_user.id)
    jobs = db.exec(jobs_statement).all()
    
    pipeline = {
        "saved": 0,
        "applied": 0,
        "interviewing": 0,
        "offer": 0,
        "rejected": 0
    }
    
    for j in jobs:
        status_key = j.status.strip().lower()
        if status_key in pipeline:
            pipeline[status_key] += 1
            
    return StatsResponse(
        total_scans=total_scans,
        avg_score=avg_score,
        total_skills_matched=total_skills_matched,
        match_history=match_history,
        skills_gap=skills_gap,
        pipeline=pipeline
    )

@router.get("/{scan_id}", response_model=ScanDetailResponse)
def get_scan_detail(
    scan_id: int,
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_session)
):
    """Retrieve the full detailed analysis for a specific past scan."""
    statement = select(ResumeScan).where(ResumeScan.id == scan_id, ResumeScan.user_id == current_user.id)
    scan = db.exec(statement).first()
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan record not found"
        )
    return scan

@router.delete("/{scan_id}", status_code=status.HTTP_200_OK)
def delete_scan(
    scan_id: int,
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_session)
):
    """Delete a specific past scan record from history."""
    statement = select(ResumeScan).where(ResumeScan.id == scan_id, ResumeScan.user_id == current_user.id)
    scan = db.exec(statement).first()
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan record not found"
        )
    db.delete(scan)
    db.commit()
    return {"message": "Scan record deleted successfully"}
