from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from pydantic import BaseModel
from typing import List
from datetime import datetime
from app.db import get_session
from app.models.models import User, ResumeScan
from app.services.auth_utils import get_current_user
import random

router = APIRouter(prefix="/admin", tags=["admin"])

def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    """Dependency to verify that the logged-in user is an administrator."""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have administrative privileges to access this resource."
        )
    return current_user

class AdminStatsResponse(BaseModel):
    total_users: int
    total_scans: int
    avg_score: float
    cpu_load: float
    latency: int

class AdminScanResponse(BaseModel):
    id: int
    userName: str
    userAvatar: str
    fileName: str
    jobTitle: str
    score: int
    date: str

@router.get("/stats", response_model=AdminStatsResponse)
def get_admin_stats(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_session)
):
    """Retrieve system-wide analytics and diagnostic status."""
    total_users = db.exec(select(User)).all()
    total_scans = db.exec(select(ResumeScan)).all()
    
    avg_score = 0.0
    if len(total_scans) > 0:
        avg_score = round(sum(s.match_score for s in total_scans) / len(total_scans), 2)
        
    # Generate some dynamic mock values for system metrics
    cpu_load = round(random.uniform(35.0, 52.0), 1)
    latency = random.randint(220, 260)
    
    return AdminStatsResponse(
        total_users=len(total_users),
        total_scans=len(total_scans),
        avg_score=avg_score,
        cpu_load=cpu_load,
        latency=latency
    )

@router.get("/scans", response_model=List[AdminScanResponse])
def get_admin_scans(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_session)
):
    """Retrieve recent resume scans from all users in the system."""
    # Order by scanned_at descending and get the last 20 scans
    statement = select(ResumeScan).order_by(ResumeScan.scanned_at.desc()).limit(20)
    scans = db.exec(statement).all()
    
    results = []
    # Dynamic avatars to show nice profile images
    avatars = [
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
    ]
    
    for s in scans:
        # Get scan owner (user relationship)
        user_email = "User"
        if s.user:
            user_email = s.user.email
            
        user_name = user_email.split("@")[0].title()
        
        # Pick avatar based on user id or file id to keep it consistent
        avatar_idx = (s.user_id or 0) % len(avatars)
        user_avatar = avatars[avatar_idx]
        
        # Get Job Title from parsed_data or default
        parsed = s.parsed_data or {}
        job_title = parsed.get("job_title") or s.file_name.replace(".pdf", "").replace("_", " ").title()
        
        results.append(
            AdminScanResponse(
                id=s.id,
                userName=user_name,
                userAvatar=user_avatar,
                fileName=s.file_name,
                jobTitle=job_title,
                score=int(round(s.match_score)),
                date=s.scanned_at.strftime("%b %d, %Y")
            )
        )
        
    return results
