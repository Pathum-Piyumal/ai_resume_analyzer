from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.db import get_session
from app.models.models import User, ResumeScan
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
