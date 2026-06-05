from sqlmodel import Field, SQLModel, Relationship
from typing import Optional, List, Dict, Any
from datetime import datetime
from sqlalchemy import Column, JSON

class UserSetting(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", ondelete="CASCADE", unique=True)
    theme: str = Field(default="dark")
    email_notifications: bool = Field(default=True)
    
    # Relationship back to User
    user: Optional["User"] = Relationship(back_populates="setting")

class SavedJob(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", ondelete="CASCADE")
    title: str
    company: str
    location: Optional[str] = Field(default=None)
    link: Optional[str] = Field(default=None)
    status: str = Field(default="saved") # "saved" or "applied"
    saved_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationship back to User
    user: Optional["User"] = Relationship(back_populates="saved_jobs")

class ResumeScan(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", ondelete="CASCADE")
    file_name: str
    match_score: float
    resume_text: str
    job_description: str
    parsed_data: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    scanned_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationship back to User
    user: Optional["User"] = Relationship(back_populates="scans")

class PasswordResetToken(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True)
    token: str = Field(index=True, unique=True)
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    hashed_password: Optional[str] = Field(default=None, nullable=True) # Optional for Google sign-in
    google_id: Optional[str] = Field(default=None, unique=True, nullable=True) # Optional link to Google account
    role: str = Field(default="job_seeker") # "job_seeker" or "admin"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    setting: Optional[UserSetting] = Relationship(back_populates="user", sa_relationship_kwargs={"uselist": False})
    saved_jobs: List[SavedJob] = Relationship(back_populates="user")
    scans: List[ResumeScan] = Relationship(back_populates="user")
