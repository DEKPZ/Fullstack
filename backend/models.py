# backend/models.py

from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

from sqlalchemy import Column, Integer, String, DateTime, func
from datetime import datetime, timedelta

class User(Base):
    """
    SQLAlchemy model for the 'users' table.
    Represents a user in the system, which can be a student, employer, or admin.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="student", nullable=False) # 'student', 'employer', 'admin'
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)
    address = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    profile_picture_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_verified = Column(Boolean, default=False)
    credits = Column(Integer, default=5)
    is_premium = Column(Boolean, default=False)
    last_credit_refill = Column(DateTime(timezone=True), server_default=func.now())
    premium_expires_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    student_profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    employer_profile = relationship("EmployerProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    internships_posted = relationship("Internship", back_populates="employer", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="student", cascade="all, delete-orphan")

    # ... existing columns
    otp = Column(String, nullable=True)
    otp_expires_at = Column(DateTime(timezone=True), nullable=True)
    # ... rest of the model

class StudentProfile(Base):
    """
    SQLAlchemy model for the 'student_profiles' table.
    Stores additional details specific to student users.
    """
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    education = Column(Text, nullable=True) # e.g., JSON string or comma-separated
    skills = Column(Text, nullable=True) # e.g., JSON string or comma-separated
    experience = Column(Text, nullable=True) # e.g., JSON string or comma-separated
    resume_url = Column(String, nullable=True)
    portfolio_url = Column(String, nullable=True)
    
    # New fields for more detailed profile
    projects = Column(Text, nullable=True)
    certifications = Column(Text, nullable=True)
    career_goals = Column(Text, nullable=True)
    internship_preferences = Column(Text, nullable=True)
    github_link = Column(String, nullable=True)
    linkedin_profile = Column(String, nullable=True)

    user = relationship("User", back_populates="student_profile")

class EmployerProfile(Base):
    """
    SQLAlchemy model for the 'employer_profiles' table.
    Stores additional details specific to employer users.
    """
    __tablename__ = "employer_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    company_name = Column(String, nullable=False)
    company_description = Column(Text, nullable=True)
    website = Column(String, nullable=True)
    industry = Column(String, nullable=True)
    company_logo_url = Column(String, nullable=True)

    user = relationship("User", back_populates="employer_profile")

class Internship(Base):
    """
    SQLAlchemy model for the 'internships' table.
    Represents an internship posted by an employer.
    """
    __tablename__ = "internships"

    id = Column(Integer, primary_key=True, index=True)
    employer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)

    skills_required = Column(Text, nullable=True)
    responsibilities = Column(Text, nullable=True)
    qualifications = Column(Text, nullable=True)
    job_type = Column(String, default="Internship")
    location = Column(String, nullable=True)
    stipend = Column(String, nullable=True)
    duration = Column(String, nullable=True)
    posted_date = Column(DateTime(timezone=True), server_default=func.now())
    deadline_date = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True)
    employer = relationship("User", back_populates="internships_posted")
    applications = relationship("Application", back_populates="internship", cascade="all, delete-orphan")
    __table_args__ = {'extend_existing': True}

class Application(Base):
    """
    SQLAlchemy model for the 'applications' table.
    Represents a student's application to an internship.
    """
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    internship_id = Column(Integer, ForeignKey("internships.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    applied_date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="pending") # 'pending', 'reviewed', 'accepted', 'rejected', 'hired'
    cover_letter = Column(Text, nullable=True)
    
    # Potentially add a field for employer's notes or feedback

    internship = relationship("Internship", back_populates="applications")
    student = relationship("User", back_populates="applications")
