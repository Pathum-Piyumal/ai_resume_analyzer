from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from pydantic import BaseModel
from app.db import get_session
from app.models.models import User, UserSetting
from app.services.auth_utils import get_current_user
from app.services.stripe_service import create_stripe_checkout_session

router = APIRouter(prefix="/settings", tags=["settings"])

class UserSettingUpdate(BaseModel):
    theme: str
    email_notifications: bool
    tier: Optional[str] = None
    first_name: Optional[str] = "Job"
    last_name: Optional[str] = "Seeker"
    job_title: Optional[str] = "Software Engineer"
    avatar: Optional[str] = None

class UserSettingResponse(BaseModel):
    theme: str
    email_notifications: bool
    tier: str
    first_name: str
    last_name: str
    job_title: str
    avatar: Optional[str] = None
    
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
        setting = UserSetting(
            user_id=current_user.id, 
            theme="dark", 
            email_notifications=True,
            first_name="Job",
            last_name="Seeker",
            job_title="Software Engineer",
            avatar=None
        )
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
    if setting_data.tier is not None:
        setting.tier = setting_data.tier
    if setting_data.first_name is not None:
        setting.first_name = setting_data.first_name
    if setting_data.last_name is not None:
        setting.last_name = setting_data.last_name
    if setting_data.job_title is not None:
        setting.job_title = setting_data.job_title
    if setting_data.avatar is not None:
        setting.avatar = setting_data.avatar
    
    db.add(setting)
    db.commit()
    db.refresh(setting)
    return setting

@router.post("/upgrade", response_model=UserSettingResponse)
def upgrade_user_settings(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_session)
):
    """Upgrade the logged-in user's subscription tier to Pro."""
    statement = select(UserSetting).where(UserSetting.user_id == current_user.id)
    setting = db.exec(statement).first()
    
    if not setting:
        setting = UserSetting(user_id=current_user.id, theme="dark", email_notifications=True)
        db.add(setting)
        
    setting.tier = "pro"
    db.add(setting)
    db.commit()
    db.refresh(setting)
    return setting

class CheckoutSessionResponse(BaseModel):
    url: str
    simulated: bool

@router.post("/upgrade/checkout-session", response_model=CheckoutSessionResponse)
def get_upgrade_checkout_session(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_session)
):
    """Retrieve Stripe Checkout Session redirect URL for Pro Plan upgrade."""
    try:
        session_data = create_stripe_checkout_session(current_user.id, current_user.email)
        return CheckoutSessionResponse(
            url=session_data["url"],
            simulated=session_data["simulated"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create checkout session: {str(e)}"
        )
