# backend/main.py
# Main_sample/backend_main/main.py

# ... your existing imports like FastAPI, Depends, etc.
import io
import weasyprint

import re

import os

from mail import send_registration_email



from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from passlib.context import CryptContext


from datetime import timezone
from auth import get_current_user, create_access_token, get_password_hash, ACCESS_TOKEN_EXPIRE_MINUTES


import random
import string
from mail import send_otp_email
from datetime import datetime

from jinja2 import Template
from fastapi.responses import Response

from fastapi.responses import Response
from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List, Optional


# Changed relative imports to absolute imports
import models, schemas, crud, auth
from database import engine, Base, get_db # Base is imported here for metadata.create_all

# Create all database tables
# This should be called only once when the application starts
# This line will attempt to connect to the database and create tables if they don't exist.
Base.metadata.create_all(bind=engine)

ACCESS_TOKEN_EXPIRE_MINUTES = 30 

app = FastAPI(
    title="iIntern Darling Backend API",
    description="API for managing internships, students, employers, and applications.",
    version="1.0.0",
)

# Configure CORS middleware
origins = [
    "http://localhost:5173",  # Your React frontend's default development URL
    "http://127.0.0.1:5173",
    "http://localhost:3000", # Common React dev server port
    "http://127.0.0.1:3000",
    # Add any other origins where your frontend might be hosted in production
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def is_strong_password(password: str):
    """
    Checks if a password meets the strength requirements:
    - At least 8 characters
    - Contains at least one uppercase letter
    - Contains at least one lowercase letter
    - Contains at least one number
    - Contains at least one special character
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long."
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain an uppercase letter."
    if not re.search(r"[a-z]", password):
        return False, "Password must contain a lowercase letter."
    if not re.search(r"[0-9]", password):
        return False, "Password must contain a number."
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False, "Password must contain a special character."
    return True, "Password is strong."




# --- Integrated HTML Template for Resume Generation ---
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ personal_info.fullName }} - Resume</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        body {
            font-family: 'Manrope', 'Segoe UI', Arial, sans-serif;
            background: #f8fafc;
            color: #22223b;
            font-size: 11pt;
            margin: 0;
        }
        .container {
            max-width: 820px;
            margin: 40px auto;
            background: #fff;
            border-radius: 18px;
            box-shadow: 0 4px 32px rgba(30,64,175,0.08), 0 1.5px 6px rgba(0,0,0,0.04);
            padding: 48px 56px;
        }
        .header {
            text-align: left;
            border-bottom: 2.5px solid #2563eb;
            padding-bottom: 18px;
            margin-bottom: 32px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .name {
            font-size: 28pt;
            font-weight: 700;
            color: #2563eb;
            letter-spacing: 1px;
        }
        .contact-info {
            font-size: 10.5pt;
            color: #4b5563;
            display: flex;
            gap: 18px;
            flex-wrap: wrap;
        }
        .contact-info a {
            color: #2563eb;
            text-decoration: underline;
        }
        .section {
            margin-bottom: 32px;
        }
        .section-title {
            font-size: 15pt;
            font-weight: 700;
            color: #22223b;
            margin-bottom: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 1.5px solid #e5e7eb;
            padding-bottom: 6px;
        }
        .objective {
            font-size: 11.5pt;
            line-height: 1.7;
            text-align: justify;
            margin-bottom: 18px;
            color: #3a3a3a;
        }
        .education-item {
            margin-bottom: 12px;
        }
        .degree {
            font-weight: 700;
            font-size: 13pt;
            color: #2563eb;
        }
        .college {
            font-weight: 500;
            color: #374151;
            margin-bottom: 2px;
        }
        .education-details {
            font-size: 10.5pt;
            color: #6b7280;
        }
        .project-item, .experience-item, .certification-item {
            margin-bottom: 18px;
            padding: 16px 0 0 0;
            border-top: 1px solid #e5e7eb;
        }
        .project-title, .role {
            font-weight: 700;
            font-size: 12.5pt;
            color: #2563eb;
        }
        .company, .project-meta {
            font-weight: 500;
            color: #374151;
            font-size: 10.5pt;
            margin-bottom: 4px;
        }
        .tech-stack {
            margin: 8px 0;
        }
        .tech-item {
            display: inline-block;
            background: #e0e7ff;
            color: #2563eb;
            padding: 3px 10px;
            border-radius: 14px;
            font-size: 9.5pt;
            margin-right: 7px;
            margin-bottom: 4px;
        }
        .responsibilities {
            list-style: none;
            padding-left: 0;
            margin-top: 8px;
        }
        .responsibilities li {
            margin-bottom: 6px;
            padding-left: 18px;
            position: relative;
            font-size: 10.5pt;
        }
        .responsibilities li:before {
            content: "•";
            color: #2563eb;
            font-weight: bold;
            position: absolute;
            left: 0;
        }
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        .skill-item {
            background: #f3f4f6;
            color: #2563eb;
            padding: 5px 14px;
            border-radius: 16px;
            font-size: 10.5pt;
            font-weight: 600;
            box-shadow: 0 1px 4px rgba(37,99,235,0.07);
        }
        .certification-name {
            font-weight: 700;
            color: #2563eb;
            font-size: 11.5pt;
        }
        .certification-details {
            color: #374151;
            font-size: 10.5pt;
        }
        .github-link {
            color: #2563eb;
            font-size: 10pt;
            text-decoration: underline;
        }
        .date-range {
            color: #6b7280;
            font-size: 10.5pt;
            float: right;
        }
        @media print {
            .container {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <span class="name">{{ personal_info.fullName }}</span>
            <div class="contact-info">
                <span>{{ personal_info.email }}</span>
                <span>{{ personal_info.phone }}</span>
                {% if personal_info.githubLink %}
                <a href="{{ personal_info.githubLink }}">GitHub</a>
                {% endif %}
                {% if personal_info.linkedinProfile %}
                <a href="{{ personal_info.linkedinProfile }}">LinkedIn</a>
                {% endif %}
            </div>
        </div>

        {% if objective %}
        <div class="section">
            <div class="section-title">Career Objective</div>
            <p class="objective">{{ objective }}</p>
        </div>
        {% endif %}

        <div class="section">
            <div class="section-title">Education</div>
            <div class="education-item">
                <div class="degree">{{ education.degree }}</div>
                <div class="college">{{ education.college }}</div>
                <div class="education-details">
                    CGPA: {{ education.cgpa }} | {{ education.startDate }} - {{ education.endDate }}
                </div>
            </div>
        </div>

        {% if projects %}
        <div class="section">
            <div class="section-title">Projects</div>
            {% for project in projects %}
            <div class="project-item">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                    <div class="project-title">{{ project.title }}</div>
                    {% if project.githubLink %}
                    <a href="{{ project.githubLink }}" class="github-link">GitHub</a>
                    {% endif %}
                </div>
                <p style="margin: 8px 0; line-height: 1.6;">{{ project.description }}</p>
                {% if project.techStack %}
                <div class="tech-stack">
                    {% for tech in project.techStack %}
                    <span class="tech-item">{{ tech }}</span>
                    {% endfor %}
                </div>
                {% endif %}
            </div>
            {% endfor %}
        </div>
        {% endif %}

        {% if experience %}
        <div class="section">
            <div class="section-title">Experience</div>
            {% for exp in experience %}
            <div class="experience-item">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                    <div>
                        <div class="role">{{ exp.role }}</div>
                        <div class="company">{{ exp.company }}</div>
                    </div>
                    <div class="date-range">{{ exp.startDate }} - {{ exp.endDate }}</div>
                </div>
                {% if exp.responsibilities %}
                <ul class="responsibilities">
                    {% for responsibility in exp.responsibilities %}
                    <li>{{ responsibility }}</li>
                    {% endfor %}
                </ul>
                {% endif %}
            </div>
            {% endfor %}
        </div>
        {% endif %}

        {% if skills %}
        <div class="section">
            <div class="section-title">Technical Skills</div>
            <div class="skills-list">
                {% for skill in skills %}
                <span class="skill-item">{{ skill }}</span>
                {% endfor %}
            </div>
        </div>
        {% endif %}

        {% if certifications %}
        <div class="section">
            <div class="section-title">Certifications</div>
            {% for cert in certifications %}
            <div class="certification-item">
                <div class="certification-name">{{ cert.name }}</div>
                <div class="certification-details">{{ cert.institution }} | {{ cert.year }}</div>
            </div>
            {% endfor %}
        </div>
        {% endif %}
    </div>
</body>
</html>
"""

# --- API Endpoints ---

@app.get("/")
def read_root():
    """Root endpoint for testing API availability."""
    return {"message": "Welcome to iIntern Darling Backend API!"}

# --- Database Test Endpoint ---
@app.get("/db-test")
def test_db_connection(db: Session = Depends(get_db)):
    try:
        first_user = db.query(models.User).first()
        if first_user:
            return {"message": "Database connection successful!", "first_user_email": first_user.email}
        else:
            return {"message": "Database connection successful! No users found yet."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {e}")

# --- Sample User Endpoint ---
@app.post("/add-sample-user", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def add_sample_user(db: Session = Depends(get_db)):
    sample_email = "test.student@example.com"
    db_user = crud.get_user_by_email(db, email=sample_email)
    if db_user:
        raise HTTPException(status_code=400, detail=f"Sample user '{sample_email}' already exists.")
    user_data = schemas.UserCreate(
        email=sample_email, password="testpassword123", role="student",
        first_name="Test", last_name="Student", phone_number="123-456-7890",
        address="123 Test St", bio="A sample student for testing purposes.",
        profile_picture_url="https://placehold.co/150x150/cccccc/ffffff?text=TS"
    )
    new_user = crud.create_user(db=db, user=user_data)
    return new_user

# --- Authentication and User Registration ---
@app.post("/register/student", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_student(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    user.role = "student"
    return crud.create_user(db=db, user=user)

@app.post("/register/employer", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_employer(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    user.role = "employer"
    return crud.create_user(db=db, user=user)

@app.post("/login", response_model=schemas.Token)
def login_for_access_token(form_data: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=form_data.email)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"id": user.id, "email": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

# --- NEW: Integrated Resume Generation Endpoint ---
@app.post("/generate-resume", response_class=Response)
async def generate_resume(
    resume_data: schemas.ResumeData,
    current_user: models.User = Depends(auth.get_current_active_student)
):
    try:
        template = Template(HTML_TEMPLATE)
        html_content = template.render(
            personal_info=resume_data.personalInfo,
            objective=resume_data.objective,
            education=resume_data.education[0] if resume_data.education else None,
            projects=resume_data.projects,
            experience=resume_data.experience,
            skills=resume_data.skills,
            certifications=resume_data.certifications
        )
        pdf_buffer = io.BytesIO()
        weasyprint.HTML(string=html_content).write_pdf(pdf_buffer)
        pdf_buffer.seek(0)
        return Response(
            content=pdf_buffer.getvalue(),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={resume_data.personalInfo.fullName.replace(' ', '_')}_Resume.pdf"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating PDF: {str(e)}")

@app.get("/")
def read_root():
    """Root endpoint for testing API availability."""
    return {"message": "Welcome to iIntern Darling Backend API!"}

# --- ENDPOINT FOR DATABASE CONNECTION TEST ---
@app.get("/db-test")
def test_db_connection(db: Session = Depends(get_db)):
    """
    Tests the database connection by attempting to fetch the first user.
    If no users exist, it returns a success message indicating connection.
    This also implicitly checks if tables were created by Base.metadata.create_all.
    """
    try:
        # Attempt to query the 'users' table
        first_user = db.query(models.User).first()
        if first_user:
            return {"message": "Database connection successful!", "first_user_email": first_user.email}
        else:
            return {"message": "Database connection successful! No users found yet."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {e}")
# --- END DB TEST ENDPOINT ---

# --- NEW ENDPOINT TO ADD SAMPLE DATA ---
@app.post("/add-sample-user", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def add_sample_user(db: Session = Depends(get_db)):
    """
    Adds a sample student user to the database for testing purposes.
    If the user already exists, it returns a message indicating so.
    """
    sample_email = "test.student@example.com"
    sample_password = "testpassword123"

    db_user = crud.get_user_by_email(db, email=sample_email)
    if db_user:
        raise HTTPException(status_code=400, detail=f"Sample user '{sample_email}' already exists.")

    user_data = schemas.UserCreate(
        email=sample_email,
        password=sample_password,
        role="student",
        first_name="Test",
        last_name="Student",
        phone_number="123-456-7890",
        address="123 Test St",
        bio="A sample student for testing purposes.",
        profile_picture_url="https://placehold.co/150x150/cccccc/ffffff?text=TS"
    )
    new_user = crud.create_user(db=db, user=user_data)
    return new_user
# --- END NEW ENDPOINT ---


# --- Authentication and User Registration ---

@app.post("/register/student", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_student(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register a new student user."""
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    user.role = "student" # Ensure role is student
    return crud.create_user(db=db, user=user)

@app.post("/register/employer", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_employer(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register a new employer user."""
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    user.role = "employer" # Ensure role is employer
    return crud.create_user(db=db, user=user)

@app.post("/login", response_model=schemas.Token)
def login_for_access_token(form_data: schemas.LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user and return an access token."""
    user = crud.get_user_by_email(db, email=form_data.email)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"id": user.id, "email": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    """Get details of the current authenticated user."""
    return current_user

# --- User Management (Admin Only) ---

@app.get("/admin/users", response_model=List[schemas.UserResponse])
def read_all_users(
    skip: int = 0,
    limit: int = 100,
    role: Optional[str] = None,
    current_user: models.User = Depends(auth.get_current_active_admin),
    db: Session = Depends(get_db)
):
    """Retrieve a list of all users (Admin only)."""
    users = crud.get_users(db, skip=skip, limit=limit, role=role)
    return users

@app.get("/admin/users/{user_id}", response_model=schemas.UserResponse)
def read_user_by_id(
    user_id: int,
    current_user: models.User = Depends(auth.get_current_active_admin),
    db: Session = Depends(get_db)
):
    """Retrieve a specific user by ID (Admin only)."""
    user = crud.get_user(db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/admin/users/{user_id}", response_model=schemas.UserResponse)
def update_user_by_admin(
    user_id: int,
    user_update: schemas.UserUpdate,
    current_user: models.User = Depends(auth.get_current_active_admin),
    db: Session = Depends(get_db)
):
    """Update a user's details by ID (Admin only)."""
    user = crud.update_user(db, user_id=user_id, user_update=user_update)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.delete("/admin/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_by_admin(
    user_id: int,
    current_user: models.User = Depends(auth.get_current_active_admin),
    db: Session = Depends(get_db)
):
    """Delete a user by ID (Admin only)."""
    success = crud.delete_user(db, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

# --- Student Profile Management ---

@app.get("/students/me/profile", response_model=schemas.StudentProfileResponse)
def read_my_student_profile(
    current_user: models.User = Depends(auth.get_current_active_student),
    db: Session = Depends(get_db)
):
    """Get the current student's profile."""
    if not current_user.student_profile:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return current_user

@app.put("/students/me/profile", response_model=schemas.StudentProfileResponse)
def update_my_student_profile(
    profile_update: schemas.StudentProfileUpdate,
    current_user: models.User = Depends(auth.get_current_active_student),
    db: Session = Depends(get_db)
):
    """Update the current student's profile."""
    profile = crud.update_student_profile(db, user_id=current_user.id, profile_update=profile_update)
    if profile is None:
        raise HTTPException(status_code=404, detail="Student profile not found")
    db.refresh(current_user)
    return current_user

@app.get("/applicants/{user_id}/profile", response_model=schemas.StudentProfileResponse)
def read_applicant_profile(
    user_id: int,
    current_user: models.User = Depends(auth.get_current_active_employer),
    db: Session = Depends(get_db)
):
    """Get a specific applicant's profile by user ID (Employer only)."""
    user = crud.get_user(db, user_id=user_id)
    if not user or user.role != "student":
        raise HTTPException(status_code=404, detail="Applicant (student) not found")
    if not user.student_profile:
        raise HTTPException(status_code=404, detail="Student profile not found for this applicant")
    return user


# --- Employer Profile Management ---

@app.get("/employers/me/profile", response_model=schemas.EmployerProfileResponse)
def read_my_employer_profile(
    current_user: models.User = Depends(auth.get_current_active_employer),
    db: Session = Depends(get_db)
):
    """Get the current employer's profile."""
    profile = crud.get_employer_profile(db, user_id=current_user.id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Employer profile not found")
    return profile

@app.put("/employers/me/profile", response_model=schemas.EmployerProfileResponse)
def update_my_employer_profile(
    profile_update: schemas.EmployerProfileUpdate,
    current_user: models.User = Depends(auth.get_current_active_employer),
    db: Session = Depends(get_db)
):
    """Update the current employer's profile."""
    profile = crud.update_employer_profile(db, user_id=current_user.id, profile_update=profile_update)
    if profile is None:
        raise HTTPException(status_code=404, detail="Employer profile not found")
    return profile

# --- Internship Management ---

@app.post("/internships", response_model=schemas.InternshipResponse, status_code=status.HTTP_201_CREATED)
def create_new_internship(
    internship: schemas.InternshipCreate,
    current_user: models.User = Depends(auth.get_current_active_employer),
    db: Session = Depends(get_db)
):
    """Post a new internship (Employer only)."""
    return crud.create_internship(db=db, internship=internship, employer_id=current_user.id)

@app.get("/internships", response_model=List[schemas.InternshipResponse])
def read_internships(
    skip: int = 0,
    limit: int = 100,
    search_query: Optional[str] = Query(None, description="Search by title, description, or location"),
    db: Session = Depends(get_db)
):
    """Retrieve a list of all active internships."""
    internships = crud.get_internships(db, skip=skip, limit=limit, search_query=search_query)
    return internships

@app.get("/internships/{internship_id}", response_model=schemas.InternshipResponse)
def read_internship_detail(internship_id: int, db: Session = Depends(get_db)):
    """Retrieve details of a specific internship."""
    internship = crud.get_internship(db, internship_id=internship_id)
    if internship is None:
        raise HTTPException(status_code=404, detail="Internship not found")
    return internship

@app.put("/internships/{internship_id}", response_model=schemas.InternshipResponse)
def update_existing_internship(
    internship_id: int,
    internship_update: schemas.InternshipUpdate,
    current_user: models.User = Depends(auth.get_current_active_employer),
    db: Session = Depends(get_db)
):
    """Update an existing internship (Employer only, must own the internship)."""
    internship = crud.get_internship(db, internship_id=internship_id)
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    if internship.employer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this internship")

    updated_internship = crud.update_internship(db, internship_id=internship_id, internship_update=internship_update)
    return updated_internship

@app.delete("/internships/{internship_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_internship(
    internship_id: int,
    current_user: models.User = Depends(auth.get_current_active_employer),
    db: Session = Depends(get_db)
):
    """Delete an internship (Employer only, must own the internship)."""
    internship = crud.get_internship(db, internship_id=internship_id)
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    if internship.employer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this internship")

    success = crud.delete_internship(db, internship_id=internship_id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to delete internship")
    return {"message": "Internship deleted successfully"}

@app.get("/employers/me/internships", response_model=List[schemas.InternshipResponse])
def read_employer_internships(
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(auth.get_current_active_employer),
    db: Session = Depends(get_db)
):
    """Get all internships posted by the current employer."""
    internships = crud.get_internships(db, skip=skip, limit=limit, employer_id=current_user.id)
    return internships

# --- Application Management ---
def get_current_user_with_refill(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    """
    Checks if the user's free credits should be refilled and does so if needed.
    """
    if not current_user.is_premium and current_user.role == 'student':
        # Check if it has been more than 30 days since the last refill
        if current_user.last_credit_refill < datetime.now(timezone.utc) - timedelta(days=30):
            current_user.credits = 5
            current_user.last_credit_refill = datetime.now(timezone.utc)
            db.commit()
            db.refresh(current_user)
    return current_user

@app.post("/internships/{internship_id}/apply", response_model=schemas.ApplicationResponse, status_code=status.HTTP_201_CREATED)
def apply_for_internship(
    internship_id: int,
    application: schemas.ApplicationBase,
    current_user: models.User = Depends(auth.get_current_active_student),
    db: Session = Depends(get_db)
):
    """Student applies for an internship."""
    if current_user.role != 'student':
        raise HTTPException(status_code=403, detail="Only students can apply for internships.")


    internship = crud.get_internship(db, internship_id=internship_id)
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
     # Credit check logic
    if not current_user.is_premium:
        if current_user.credits < 1:
            raise HTTPException(status_code=403, detail="You do not have enough credits to apply.")
        current_user.credits -= 1
        db.commit()
        db.refresh(current_user)

    application_create_data = schemas.ApplicationCreate(
        internship_id=internship_id,
        cover_letter=application.cover_letter,
        status=application.status
    )
    db_application = crud.create_application(db, application=application_create_data, student_id=current_user.id)
    if db_application is None:
        raise HTTPException(status_code=400, detail="Already applied to this internship")
    return db_application

@app.get("/students/me/applications", response_model=List[schemas.ApplicationResponse])
def read_my_applications(
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(auth.get_current_active_student),
    db: Session = Depends(get_db)
):
    """Get all applications made by the current student."""
    applications = crud.get_applications_by_student(db, student_id=current_user.id, skip=skip, limit=limit)
    return applications

@app.get("/internships/{internship_id}/applicants", response_model=List[schemas.ApplicationResponse])
def read_applicants_for_internship(
    internship_id: int,
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(auth.get_current_active_employer),
    db: Session = Depends(get_db)
):
    """Get all applicants for a specific internship (Employer only, must own the internship)."""
    internship = crud.get_internship(db, internship_id=internship_id)
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    if internship.employer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view applicants for this internship")

    applications = crud.get_applications_by_internship(db, internship_id=internship.id, skip=skip, limit=limit)
    return applications

@app.put("/applications/{application_id}/status", response_model=schemas.ApplicationResponse)
def update_application_status(
    application_id: int,
    new_status: str = Query(..., description="New status for the application (e.g., 'reviewed', 'accepted', 'rejected', 'hired')"),
    current_user: models.User = Depends(auth.get_current_active_employer),
    db: Session = Depends(get_db)
):
    """Update the status of an application (Employer only)."""
    application = crud.get_application(db, application_id=application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    internship = crud.get_internship(db, internship_id=application.internship_id)
    if not internship or internship.employer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this application's status")
    
    # Credit deduction for accepting an offer (when status is 'hired')
    if new_status.lower() == 'hired':
        student = crud.get_user(db, user_id=application.student_id)
        if student and not student.is_premium:
            if student.credits < 1:
                raise HTTPException(status_code=403, detail="The student does not have enough credits to accept this offer.")
            student.credits -= 1
            db.commit()

    updated_application = crud.update_application_status(db, application_id=application_id, new_status=new_status)
    return updated_application

@app.post("/users/me/top-up-credits", response_model=schemas.UserResponse)
def top_up_credits(
    current_user: models.User = Depends(get_current_user_with_refill),
    db: Session = Depends(get_db)
):
    """
    Simulates a top-up of 2 credits for the current user.
    """
    if current_user.role != 'student':
        raise HTTPException(status_code=403, detail="Only students can top-up credits.")

    current_user.credits += 2
    db.commit()
    db.refresh(current_user)
    return current_user

@app.get("/hired-interns", response_model=List[schemas.ApplicationResponse])
def get_hired_interns(
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(auth.get_current_active_employer),
    db: Session = Depends(get_db)
):
    """Get a list of interns hired by the current employer."""
    employer_internships = crud.get_internships(db, employer_id=current_user.id)
    hired_applications = []
    for internship in employer_internships:
        applications = crud.get_applications_by_internship(db, internship_id=internship.id)
        hired_applications.extend([app for app in applications if app.status == "hired"])

    return hired_applications[skip : skip + limit]

# --- Admin Internship Management (Admin Only) ---

@app.get("/admin/internships", response_model=List[schemas.InternshipResponse])
def read_all_internships_admin(
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(auth.get_current_active_admin),
    db: Session = Depends(get_db)
):
    """Retrieve all internships (Admin only)."""
    internships = crud.get_internships(db, skip=skip, limit=limit)
    return internships

@app.delete("/admin/internships/{internship_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_internship_by_admin(
    internship_id: int,
    current_user: models.User = Depends(auth.get_current_active_admin),
    db: Session = Depends(get_db)
):
    """Delete an internship by ID (Admin only)."""
    success = crud.delete_internship(db, internship_id=internship_id)
    if not success:
        raise HTTPException(status_code=404, detail="Internship not found")
    return {"message": "Internship deleted successfully"}


# backend/main.py
# ... existing imports
import random
import string
from mail import send_otp_email
from datetime import datetime

# ... existing code

def generate_otp(length: int = 6):
    """Generate a random OTP."""
    characters = string.digits
    return "".join(random.choice(characters) for _ in range(length))

@app.post("/forgot-password")
async def forgot_password(request: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=request.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    otp = generate_otp()
    crud.set_user_otp(db, user=user, otp=otp)

    await send_otp_email(email=user.email, otp=otp)
    return {"message": "OTP sent to your email address."}


@app.post("/reset-password")
def reset_password(request: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=request.email)

    if not user or user.otp != request.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    if user.otp_expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="OTP has expired")

    crud.reset_user_password(db, user=user, new_password=request.new_password)
    return {"message": "Password has been reset successfully."}

# === STEP 1: REQUEST OTP ===


# === STEP 2: VERIFY AND COMPLETE REGISTRATION ===
@app.post("/verify-and-register", response_model=schemas.Token)
def verify_and_register(verification_data: schemas.UserVerify, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=verification_data.email)

    # Validate OTP
    if not user or user.otp != verification_data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    if user.otp_expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="OTP has expired")

    # Activate user
    crud.verify_user(db, user=user)

    # Create and return access token for immediate login
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/request-register-otp", status_code=200)
async def request_registration_otp(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    # 1. Validate Password Strength
    is_strong, message = is_strong_password(user_data.password)
    if not is_strong:
        raise HTTPException(status_code=400, detail=message)

    # 2. Check if user exists
    db_user = crud.get_user_by_email(db, email=user_data.email)
    if db_user and db_user.is_verified:
        raise HTTPException(status_code=400, detail="Email already registered and verified.")

    # 3. Create or update the unverified user
    if not db_user:
        crud.create_user(db=db, user=user_data, is_verified=False)
    else:
        crud.update_unverified_user(db=db, user_data=user_data)

    # 4. Send OTP
    user_to_verify = crud.get_user_by_email(db, email=user_data.email)
    otp = generate_otp()
    crud.set_user_otp(db, user=user_to_verify, otp=otp)

    # 5. Await the new email function
    print(f"Attempting to send registration OTP to {user_data.email}")
    await send_registration_email(email=user_data.email, otp=otp)
    print("Registration OTP email sent successfully.")
    
    
    return {"message": "Verification OTP sent to your email. It will expire in 10 minutes."}


# === STEP 2: VERIFY AND COMPLETE REGISTRATION ===
@app.post("/verify-and-register", response_model=schemas.Token)
def verify_and_register(verification_data: schemas.UserVerify, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=verification_data.email)

    # Validate OTP
    if not user or user.otp != verification_data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    if user.otp_expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="OTP has expired")

    # Activate user
    crud.verify_user(db, user=user)

    # Create and return access token for immediate login
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
