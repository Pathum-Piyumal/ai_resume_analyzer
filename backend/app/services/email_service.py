import os
import smtplib
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

logger = logging.getLogger(__name__)

# Load SMTP configurations
SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM = os.getenv("SMTP_FROM", "noreply@resumeiq.com")

def send_reset_email(to_email: str, token: str):
    """
    Sends a password reset recovery email to the user.
    Falls back to logging in the terminal if SMTP credentials are not configured.
    """
    reset_link = f"http://localhost:5173/?reset_token={token}"
    
    # 1. Fallback if not configured
    if not SMTP_HOST or not SMTP_USER or not SMTP_PASSWORD:
        logger.warning("SMTP settings not configured in .env. Falling back to console logging.")
        print("\n" + "="*80)
        print(f" PASSWORD RESET EMAIL SIMULATOR (No SMTP configured)")
        print(f" To: {to_email}")
        print(f" Reset Link: {reset_link}")
        print("="*80 + "\n")
        return

    # 2. HTML Email Template
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Reset Your ResumeIQ Password</title>
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f6f9;
                margin: 0;
                padding: 0;
                color: #333333;
            }}
            .container {{
                max-width: 550px;
                margin: 40px auto;
                background: #ffffff;
                border-radius: 12px;
                padding: 30px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                border: 1px solid #eef2f5;
            }}
            .logo {{
                font-size: 22px;
                font-weight: 800;
                color: #2563eb;
                margin-bottom: 25px;
                text-align: center;
                letter-spacing: -0.5px;
            }}
            h2 {{
                color: #1e293b;
                font-size: 20px;
                margin-top: 0;
                margin-bottom: 15px;
            }}
            p {{
                font-size: 14px;
                line-height: 1.6;
                color: #475569;
                margin-bottom: 20px;
            }}
            .btn-container {{
                text-align: center;
                margin: 30px 0;
            }}
            .btn {{
                background-color: #2563eb;
                color: #ffffff !important;
                text-decoration: none;
                padding: 12px 28px;
                font-size: 14px;
                font-weight: 700;
                border-radius: 8px;
                display: inline-block;
                box-shadow: 0 4px 6px rgba(37, 99, 235, 0.15);
            }}
            .footer {{
                font-size: 11px;
                color: #94a3b8;
                text-align: center;
                margin-top: 35px;
                border-top: 1px solid #f1f5f9;
                padding-top: 20px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">ResumeIQ</div>
            <h2>Password Reset Request</h2>
            <p>Hello,</p>
            <p>We received a request to reset the password for your ResumeIQ account. Click the button below to choose a new password. This recovery token is active for 15 minutes.</p>
            <div class="btn-container">
                <a href="{reset_link}" class="btn">Reset Password</a>
            </div>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
            <div class="footer">
                &copy; 2026 ResumeIQ. All rights reserved.<br>
                If the button above does not work, copy and paste this URL into your browser:<br>
                <a href="{reset_link}" style="color: #64748b;">{reset_link}</a>
            </div>
        </div>
    </body>
    </html>
    """

    # 3. Compile Message
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Reset Your ResumeIQ Password"
    msg["From"] = SMTP_FROM
    msg["To"] = to_email
    
    msg.attach(MIMEText(f"Reset your password by visiting: {reset_link}", "plain"))
    msg.attach(MIMEText(html_content, "html"))

    # 4. Dispatch Email via SMTP
    try:
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        logger.info(f"Successfully sent password reset email to {to_email}")
    except Exception as e:
        logger.error(f"Failed to dispatch reset email via SMTP: {e}")
        # Log recovery link as fallback if sending fails so developer can still access it
        print(f"\n[SMTP FAILED FALLBACK] Reset Link for {to_email}: {reset_link}\n")
