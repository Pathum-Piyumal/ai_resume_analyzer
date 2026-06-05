from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from pydantic import BaseModel
from typing import List, Optional
from app.db import get_session
from app.models.models import User, SavedJob
from app.services.auth_utils import get_current_user

router = APIRouter(prefix="/jobs", tags=["jobs"])

class SavedJobCreate(BaseModel):
    title: str
    company: str
    location: Optional[str] = None
    link: Optional[str] = None

class SavedJobResponse(BaseModel):
    id: int
    user_id: int
    title: str
    company: str
    location: Optional[str]
    link: Optional[str]
    status: str
    
    class Config:
        from_attributes = True

@router.get("/saved", response_model=List[SavedJobResponse])
def get_saved_jobs(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_session)
):
    """Retrieve all saved jobs for the logged-in user."""
    statement = select(SavedJob).where(SavedJob.user_id == current_user.id)
    return db.exec(statement).all()

@router.post("/saved", response_model=SavedJobResponse, status_code=status.HTTP_201_CREATED)
def save_job(
    job_data: SavedJobCreate,
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_session)
):
    """Save a job posting to the user's dashboard."""
    # Check if this job has already been saved by the current user
    existing_job = db.exec(
        select(SavedJob).where(
            SavedJob.user_id == current_user.id,
            SavedJob.company == job_data.company,
            SavedJob.title == job_data.title
        )
    ).first()
    if existing_job:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already saved this job posting."
        )
        
    new_job = SavedJob(
        user_id=current_user.id,
        title=job_data.title,
        company=job_data.company,
        location=job_data.location,
        link=job_data.link,
        status="saved"
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job

@router.delete("/saved/{job_id}", status_code=status.HTTP_200_OK)
def unsave_job(
    job_id: int,
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_session)
):
    """Unsave a job posting from the user's dashboard."""
    statement = select(SavedJob).where(SavedJob.id == job_id, SavedJob.user_id == current_user.id)
    job = db.exec(statement).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Saved job not found"
        )
    db.delete(job)
    db.commit()
    return {"message": "Job unsaved successfully"}

class SavedJobStatusUpdate(BaseModel):
    status: str

@router.put("/saved/{job_id}/status", response_model=SavedJobResponse)
def update_job_status(
    job_id: int,
    status_data: SavedJobStatusUpdate,
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_session)
):
    """Update the application status of a saved job (e.g. applied, interviewing)."""
    statement = select(SavedJob).where(SavedJob.id == job_id, SavedJob.user_id == current_user.id)
    job = db.exec(statement).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Saved job not found"
        )
    
    valid_statuses = ["saved", "applied", "interviewing", "offer", "rejected"]
    new_status = status_data.status.strip().lower()
    if new_status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid job status. Must be one of: {', '.join(valid_statuses)}"
        )
        
    job.status = new_status
    db.add(job)
    db.commit()
    db.refresh(job)
    return job

