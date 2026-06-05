from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from pydantic import BaseModel
from app.db import get_session
from app.models.models import User, UserSetting
from app.services.auth_utils import get_current_user

router = APIRouter(prefix="/settings", tags=["settings"])

class UserSettingUpdate(BaseModel):
    theme: str
    email_notifications: bool

class UserSettingResponse(BaseModel):
    theme: str
    email_notifications: bool
    
    class Config:
        from_attributes = True

@router.get("", response_model=UserSettingResponse)
def get_user_settings(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_session)
):
    """Retrieve the settings for the logged-in user."""
    statement = select(UserSetting).where(UserSetting.user_id == current_user.id)
    setting = db.exec(statement).first()
    
    # Lazy initialization if not exists
    if not setting:
        setting = UserSetting(user_id=current_user.id, theme="dark", email_notifications=True)
        db.add(setting)
        db.commit()
        db.refresh(setting)
        
    return setting

@router.put("", response_model=UserSettingResponse)
def update_user_settings(
    setting_data: UserSettingUpdate,
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_session)
):
    """Update settings (e.g. toggle light/dark theme) for the logged-in user."""
    statement = select(UserSetting).where(UserSetting.user_id == current_user.id)
    setting = db.exec(statement).first()
    
    if not setting:
        setting = UserSetting(user_id=current_user.id)
        db.add(setting)
        
    setting.theme = setting_data.theme
    setting.email_notifications = setting_data.email_notifications
    
    db.add(setting)
    db.commit()
    db.refresh(setting)
    return setting
