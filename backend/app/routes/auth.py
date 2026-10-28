from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select, delete
from pydantic import BaseModel, Field, field_validator
from sqlalchemy.exc import IntegrityError
from typing import Optional
from datetime import datetime, timedelta
import secrets
import os
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from app.db import get_session
from app.models.models import User, UserSetting, PasswordResetToken
from app.services.auth_utils import get_password_hash, verify_password, create_access_token, get_current_user
from app.services.email_service import send_reset_email
from app.config import is_production

RESET_MESSAGE = "If an account exists for this email, a password reset link has been sent."

class EmailRequest(BaseModel):
    email: str = Field(max_length=254)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value):
        import re
        value = value.strip().lower()
        if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", value):
            raise ValueError("Enter a valid email address")
        return value

class PasswordRequest(BaseModel):
    password: str = Field(min_length=8, max_length=72)

    @field_validator("password")
    @classmethod
    def validate_password(cls, value):
        if len(value.encode("utf-8")) > 72:
            raise ValueError("Password must be at most 72 UTF-8 bytes")
        return value

router = APIRouter(prefix="/auth", tags=["auth"])

class UserRegister(EmailRequest, PasswordRequest):
    full_name: str = Field(default="", max_length=150)

class UserResponse(BaseModel):
    id: int
    email: str
    role: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class ForgotPasswordRequest(EmailRequest):
    pass

class ResetPasswordRequest(PasswordRequest):
    token: str = Field(min_length=20, max_length=200)

class GoogleLoginRequest(BaseModel):
    id_token: str

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserRegister, db: Session = Depends(get_session)):
    # Normalize email
    normalized_email = user_data.email.strip().lower()
    
    # Check if user already exists
    statement = select(User).where(User.email == normalized_email)
    existing_user = db.exec(statement).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists"
        )
    
    # Hash password and create User
    hashed_pwd = get_password_hash(user_data.password)
    new_user = User(
        email=normalized_email,
        hashed_password=hashed_pwd,
        role="job_seeker"
    )
    db.add(new_user)
    try:
        db.flush()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="A user with this email already exists")
    
    # Initialize user settings default
    name_parts = user_data.full_name.strip().split(maxsplit=1)
    new_setting = UserSetting(
        user_id=new_user.id,
        theme="dark",
        email_notifications=True,
        first_name=name_parts[0] if name_parts else "Job",
        last_name=name_parts[1] if len(name_parts) > 1 else "",
    )
    db.add(new_setting)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="A user with this email already exists")
    db.refresh(new_user)
    
    return new_user

@router.post("/login", response_model=Token)
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_session)
):
    # Normalize email
    normalized_email = form_data.username.strip().lower()
    
    # Retrieve user by username (which is email in our auth flow)
    statement = select(User).where(User.email == normalized_email)
    user = db.exec(statement).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate token
    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "role": user.role
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Retrieve details of the currently authenticated user."""
    return current_user

@router.post("/forgot-password")
def forgot_password(
    req_data: ForgotPasswordRequest, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_session)
):
    from app.services.email_service import email_delivery_configured
    if is_production() and not email_delivery_configured():
        raise HTTPException(status_code=503, detail="Password recovery is temporarily unavailable. Please contact support.")
    # Clean up expired tokens dynamically
    db.exec(delete(PasswordResetToken).where(PasswordResetToken.expires_at < datetime.utcnow()))
    db.commit()
    
    normalized_email = req_data.email.strip().lower()
    
    # Check if user exists
    user = db.exec(select(User).where(User.email == normalized_email)).first()
    if not user:
        return {"message": RESET_MESSAGE}
        
    # Delete any existing reset token for this email
    existing_token = db.exec(select(PasswordResetToken).where(PasswordResetToken.email == normalized_email)).first()
    if existing_token:
        db.delete(existing_token)
        db.commit()
        
    # Generate token
    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(minutes=15)
    
    reset_token = PasswordResetToken(
        email=normalized_email,
        token=token,
        expires_at=expires_at
    )
    db.add(reset_token)
    db.commit()
    
    # Send email in background task
    background_tasks.add_task(send_reset_email, normalized_email, token)
    
    return {"message": RESET_MESSAGE}

@router.post("/reset-password")
def reset_password(req_data: ResetPasswordRequest, db: Session = Depends(get_session)):
    # Validate token
    reset_token = db.exec(select(PasswordResetToken).where(PasswordResetToken.token == req_data.token)).first()
    if not reset_token or reset_token.expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The password reset token is invalid or has expired."
        )
        
    # Retrieve user
    user = db.exec(select(User).where(User.email == reset_token.email)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User associated with this token not found."
        )
        
    # Update password
    hashed_pwd = get_password_hash(req_data.password)
    user.hashed_password = hashed_pwd
    db.add(user)
    
    # Delete token
    db.delete(reset_token)
    db.commit()
    
    return {"message": "Password has been reset successfully."}

@router.post("/google", response_model=Token)
def google_auth(req_data: GoogleLoginRequest, db: Session = Depends(get_session)):
    # Never accept client-generated mock identities.
    if req_data.id_token.startswith("mock_google_token:"):
        raise HTTPException(status_code=401, detail="Invalid Google credential")
    else:
        google_client_id = os.getenv("GOOGLE_CLIENT_ID")
        if not google_client_id:
            raise HTTPException(status_code=503, detail="Google sign-in is not configured")
        try:
            id_info = id_token.verify_oauth2_token(
                req_data.id_token,
                google_requests.Request(),
                audience=google_client_id
            )
            email = id_info.get("email")
            google_id = id_info.get("sub")
            if not id_info.get("email_verified") or not google_id:
                raise ValueError("Unverified Google identity")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Google credential"
            )
            
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google ID token does not contain email claim."
        )
        
    normalized_email = email.strip().lower()
    
    # Check if user exists by email
    user = db.exec(select(User).where(User.email == normalized_email)).first()
    
    if not user:
        # Create a new user with google_id
        user = User(
            email=normalized_email,
            google_id=google_id,
            role="job_seeker"
        )
        db.add(user)
        db.flush()
        
        # Initialize default user settings
        new_setting = UserSetting(
            user_id=user.id,
            theme="dark",
            email_notifications=True
        )
        db.add(new_setting)
        db.commit()
    else:
        # Update google_id if not present
        if not user.google_id:
            user.google_id = google_id
            db.add(user)
            db.commit()
            db.refresh(user)
            
    # Generate token
    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "role": user.role
    }
