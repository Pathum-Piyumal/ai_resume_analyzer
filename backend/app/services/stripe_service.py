import os
import logging

logger = logging.getLogger(__name__)

def create_stripe_checkout_session(user_id: int, user_email: str) -> dict:
    """Creates a Stripe Checkout Session or returns a local simulated link if keys are missing."""
    stripe_secret = os.getenv("STRIPE_SECRET_KEY")
    if not stripe_secret:
        # Return a simulated success link that will call our mock DB switch
        # For convenience, we redirect directly to a simulated route on the frontend
        # that passes a query parameter to indicate mock success.
        return {
            "url": f"http://localhost:5173/?upgrade_simulation=true&user_id={user_id}",
            "simulated": True
        }
        
    import stripe
    stripe.api_key = stripe_secret
    try:
        # Create Stripe session
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            customer_email=user_email,
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': 'ResumeIQ Pro Plan',
                        'description': 'Unlimited resume analysis, advanced skill mapping, and custom cover letters.',
                    },
                    'unit_amount': 1500, # $15.00
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url='http://localhost:5173/?upgrade=success',
            cancel_url='http://localhost:5173/?upgrade=cancel',
            metadata={
                'user_id': str(user_id)
            }
        )
        return {
            "url": session.url,
            "simulated": False
        }
    except Exception as e:
        logger.error(f"Failed to create Stripe Checkout Session: {e}")
        raise e

def verify_stripe_webhook(payload: bytes, sig_header: str) -> dict:
    """Verifies Stripe Webhook signature and returns the event object."""
    import stripe
    stripe_secret = os.getenv("STRIPE_SECRET_KEY")
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
    stripe.api_key = stripe_secret
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
        return event
    except Exception as e:
        logger.error(f"Stripe Webhook verification failed: {e}")
        raise e
