# backend/mail.py

import os
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema
from dotenv import load_dotenv

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT")),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS=os.getenv("MAIL_STARTTLS", "True").lower() in ("true", "1", "t"),
    MAIL_SSL_TLS=os.getenv("MAIL_SSL_TLS", "False").lower() in ("true", "1", "t"),
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

fm = FastMail(conf)

async def send_otp_email(email: str, otp: str):
    message = MessageSchema(
        subject="Your Password Reset OTP",
        recipients=[email],
        body=f"Your OTP for password reset is: {otp}",
        subtype="html"
    )
    await fm.send_message(message)

async def send_registration_email(email: str, otp: str):
    message = MessageSchema(
        subject="Welcome to I-Intern! Verify Your Email",
        recipients=[email],
        body=f"""
        <p>Thank you for registering with I-Intern!</p>
        <p>Your One-Time Password (OTP) to verify your account is: <strong>{otp}</strong></p>
        <p>This OTP is valid for 10 minutes.</p>
        """,
        subtype="html"
    )
    await fm.send_message(message)