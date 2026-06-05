from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from pydantic import BaseModel
from typing import Optional
from app.db import get_session
from app.models.models import User, UserSetting
from app.services.auth_utils import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

class UserRegister(BaseModel):
    email: str
    password: str

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
    db.commit()
    db.refresh(new_user)
    
    # Initialize user settings default
    new_setting = UserSetting(
        user_id=new_user.id,
        theme="dark",
        email_notifications=True
    )
    db.add(new_setting)
    db.commit()
    
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
