# backend/auth.py

import os
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from dotenv import load_dotenv

# Changed relative imports to absolute imports
import models, schemas
from database import get_db

# Load environment variables
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2PasswordBearer for token extraction from headers
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain password against a hashed password.
    """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """
    Hashes a plain password.
    """
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Creates a JWT access token.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Dependency to get the current authenticated user from the JWT token.
    Raises HTTPException if token is invalid or user not found.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("id")
        user_email: str = payload.get("email")
        user_role: str = payload.get("role")
        if user_id is None or user_email is None or user_role is None:
            raise credentials_exception
        token_data = schemas.TokenData(id=user_id, email=user_email, role=user_role)
    except JWTError:
        raise credentials_exception

    user = db.query(models.User).filter(models.User.id == token_data.id).first()
    if user is None:
        raise credentials_exception
    return user

def get_current_active_student(current_user: models.User = Depends(get_current_user)):
    """Dependency to ensure the current user is an active student."""
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Not authorized as a student")
    return current_user

def get_current_active_employer(current_user: models.User = Depends(get_current_user)):
    """Dependency to ensure the current user is an active employer."""
    if current_user.role != "employer":
        raise HTTPException(status_code=403, detail="Not authorized as an employer")
    return current_user

def get_current_active_admin(current_user: models.User = Depends(get_current_user)):
    """Dependency to ensure the current user is an active admin."""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized as an admin")
    return current_user
