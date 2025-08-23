# backend/schemas.py

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# --- User Schemas ---

# Pydantic models
class PersonalInfo(BaseModel):
    fullName: str
    email: str
    phone: str
    githubLink: Optional[str] = ""
    linkedinProfile: Optional[str] = ""

class Education(BaseModel):
    degree: str
    college: str
    cgpa: str
    startDate: str
    endDate: str

class Project(BaseModel):
    id: str
    title: str
    description: str
    techStack: List[str]
    githubLink: Optional[str] = ""

class Experience(BaseModel):
    id: str
    role: str
    company: str
    startDate: str
    endDate: str
    responsibilities: List[str]

class Certification(BaseModel):
    id: str
    name: str
    institution: str
    year: str

class ResumeData(BaseModel):
    personalInfo: PersonalInfo
    objective: str
    education: List[Education]
    projects: List[Project]
    experience: List[Experience]
    skills: List[str]
    certifications: List[Certification]

class UserBase(BaseModel):
    """Base schema for user data."""
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    bio: Optional[str] = None
    profile_picture_url: Optional[str] = None

class UserCreate(UserBase):
    """Schema for creating a new user (with password)."""
    password: str
    role: str = "student" # Default role

class UserUpdate(UserBase):
    """Schema for updating an existing user."""
    password: Optional[str] = None
    role: Optional[str] = None # Role can be updated by admin

class UserInDB(UserBase):
    """Schema for user data as stored in the database (includes ID and hashed password)."""
    id: int
    hashed_password: str
    role: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True # Enable ORM mode

class UserResponse(UserBase):
    """Schema for user data returned in API responses (excludes hashed password)."""
    id: int
    role: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    credits: int
    is_premium: bool

    class Config:
        from_attributes = True

# --- Student Profile Schemas ---

class StudentProfileBase(BaseModel):
    """Base schema for student profile data."""
    education: Optional[str] = None
    skills: Optional[str] = None
    experience: Optional[str] = None
    resume_url: Optional[str] = None
    portfolio_url: Optional[str] = None

class StudentProfileCreate(StudentProfileBase):
    """Schema for creating a student profile."""
    pass # No extra fields needed on creation beyond base

class StudentProfileUpdate(StudentProfileBase):
    """Schema for updating a student profile."""
    pass # No extra fields needed on update beyond base

# --- MODIFICATION START ---
# This is the corrected response model for a student's profile.
class StudentProfileResponse(StudentProfileBase):
    """
    Schema for student profile data returned in API responses.
    This now includes fields from the related User model to avoid extra API calls.
    """
    # Inherited from StudentProfileBase: education, skills, experience, etc.

    # Added from the User model for a complete response:
    id: int  # User ID
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: EmailStr
    phone_number: Optional[str] = None
    
    # The original 'user_id' is no longer needed as 'id' serves this purpose.

    class Config:
        from_attributes = True
# --- MODIFICATION END ---


# --- Employer Profile Schemas ---

class EmployerProfileBase(BaseModel):
    """Base schema for employer profile data."""
    company_name: str
    company_description: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    company_logo_url: Optional[str] = None

class EmployerProfileCreate(EmployerProfileBase):
    """Schema for creating an employer profile."""
    pass

class EmployerProfileUpdate(EmployerProfileBase):
    """Schema for updating an employer profile."""
    pass

class EmployerProfileResponse(EmployerProfileBase):
    """Schema for employer profile data returned in API responses."""
    id: int
    user_id: int

    class Config:
        from_attributes = True

# --- Internship Schemas ---

class InternshipBase(BaseModel):
    """Base schema for internship data."""
    title: str
    description: str
    requirements: Optional[str] = None
    location: Optional[str] = None
    stipend: Optional[str] = None
    duration: Optional[str] = None
    deadline_date: Optional[datetime] = None
    is_active: bool = True

class InternshipCreate(InternshipBase):
    """Schema for creating a new internship."""
    pass

class InternshipUpdate(InternshipBase):
    """Schema for updating an existing internship."""
    pass

class InternshipResponse(InternshipBase):
    """Schema for internship data returned in API responses."""
    id: int
    employer_id: int
    posted_date: datetime

    class Config:
        from_attributes = True

# --- Application Schemas ---

class ApplicationBase(BaseModel):
    """Base schema for application data."""
    cover_letter: Optional[str] = None
    status: str = "pending" # 'pending', 'reviewed', 'accepted', 'rejected', 'hired'

class ApplicationCreate(ApplicationBase):
    """Schema for creating a new application."""
    internship_id: int

class ApplicationUpdate(ApplicationBase):
    """Schema for updating an existing application."""
    pass

class ApplicationResponse(ApplicationBase):
    """Schema for application data returned in API responses."""
    id: int
    internship_id: int
    student_id: int
    applied_date: datetime

    class Config:
        from_attributes = True

# --- Auth Schemas ---

class Token(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    token_type: str

class TokenData(BaseModel):
    """Schema for data contained within a JWT token."""
    email: Optional[str] = None
    id: Optional[int] = None
    role: Optional[str] = None

class LoginRequest(BaseModel):
    """Schema for user login request."""
    email: EmailStr
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

class UserVerify(BaseModel):
    email: EmailStr
    otp: str