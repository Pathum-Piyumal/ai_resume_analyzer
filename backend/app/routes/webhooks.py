import os
import logging
from fastapi import APIRouter, Request, HTTPException, status, Depends
from sqlmodel import Session, select
from app.db import get_session
from app.models.models import UserSetting
from app.services.stripe_service import verify_stripe_webhook

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/webhooks", tags=["webhooks"])

@router.post("/stripe")
async def stripe_webhook(request: Request, db: Session = Depends(get_session)):
    """Receives webhook notifications from Stripe and processes completed checkout sessions."""
    payload = await request.body()
    sig_header = request.headers.get("Stripe-Signature")
    
    if not sig_header:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing Stripe-Signature header"
        )
        
    try:
        event = verify_stripe_webhook(payload, sig_header)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Webhook verification failed: {str(e)}"
        )
        
    event_type = event.get("type")
    logger.info(f"Received Stripe Webhook event: {event_type}")
    
    if event_type == "checkout.session.completed":
        session = event.get("data", {}).get("object", {})
        metadata = session.get("metadata", {})
        user_id_str = metadata.get("user_id")
        
        if not user_id_str:
            logger.error("No user_id found in Stripe Checkout session metadata")
            return {"status": "error", "message": "No user_id in metadata"}
            
        try:
            user_id = int(user_id_str)
            # Find and upgrade the user settings
            statement = select(UserSetting).where(UserSetting.user_id == user_id)
            setting = db.exec(statement).first()
            
            if not setting:
                setting = UserSetting(user_id=user_id, theme="dark", email_notifications=True)
                db.add(setting)
                
            setting.tier = "pro"
            db.add(setting)
            db.commit()
            db.refresh(setting)
            logger.info(f"User {user_id} upgraded to Pro subscription via Stripe Webhook")
            return {"status": "success", "message": "User settings upgraded to Pro"}
            
        except Exception as e:
            logger.error(f"Failed to process Stripe upgrade for user {user_id_str}: {e}")
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to complete checkout processing: {str(e)}"
            )
            
    return {"status": "ignored", "event_type": event_type}
