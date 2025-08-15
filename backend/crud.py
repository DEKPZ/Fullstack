# backend/crud.py

from datetime import datetime, timedelta

from datetime import timezone

from sqlalchemy.orm import Session
from sqlalchemy import or_
# Changed relative imports to absolute imports
import models, schemas
from auth import get_password_hash # Import the hashing utility

# --- User CRUD Operations ---

def get_user(db: Session, user_id: int):
    """Retrieve a user by ID."""
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    """Retrieve a user by email."""
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100, role: str = None):
    """Retrieve a list of users, optionally filtered by role."""
    query = db.query(models.User)
    if role:
        query = query.filter(models.User.role == role)
    return query.offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate, is_verified: bool = False):
    """Create a new user with a hashed password and associated profile."""
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        role=user.role,
        first_name=user.first_name,
        last_name=user.last_name,
        phone_number=user.phone_number,
        address=user.address,
        bio=user.bio,
        profile_picture_url=user.profile_picture_url,
        is_verified=is_verified        
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Create associated profile based on role
    if user.role == "student":
        db_student_profile = models.StudentProfile(user_id=db_user.id)
        db.add(db_student_profile)
    elif user.role == "employer":
        # For employer, company_name is required in EmployerProfileCreate schema
        # but UserCreate doesn't have it directly. We'll need to handle this
        # in the route or assume it's set later. For now, create a basic one.
        db_employer_profile = models.EmployerProfile(
            user_id=db_user.id,
            company_name=user.first_name + " " + user.last_name + "'s Company" if user.first_name and user.last_name else "New Company"
        )
        db.add(db_employer_profile)
    db.commit()
    db.refresh(db_user) # Refresh again to load the relationship if needed
    return db_user

def update_unverified_user(db: Session, user_data: schemas.UserCreate): # NEW FUNCTION
    """Updates user details for an unverified user."""
    db_user = get_user_by_email(db, email=user_data.email)
    if db_user:
        db_user.hashed_password = get_password_hash(user_data.password)
        db_user.first_name = user_data.first_name
        db_user.last_name = user_data.last_name
        db_user.phone_number = user_data.phone_number
        db_user.address = user_data.address
        db.commit()
        db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user_update: schemas.UserUpdate):
    """Update an existing user's details."""
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        return None

    update_data = user_update.model_dump(exclude_unset=True)
    if "password" in update_data and update_data["password"]:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))

    for key, value in update_data.items():
        setattr(db_user, key, value)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    """Delete a user by ID."""
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
        return True
    return False

# --- Student Profile CRUD Operations ---

def get_student_profile(db: Session, user_id: int):
    """Retrieve a student profile by user ID."""
    return db.query(models.StudentProfile).filter(models.StudentProfile.user_id == user_id).first()

def update_student_profile(db: Session, user_id: int, profile_update: schemas.StudentProfileUpdate):
    """Update a student's profile."""
    db_profile = db.query(models.StudentProfile).filter(models.StudentProfile.user_id == user_id).first()
    if not db_profile:
        return None

    update_data = profile_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_profile, key, value)

    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

# --- Employer Profile CRUD Operations ---

def get_employer_profile(db: Session, user_id: int):
    """Retrieve an employer profile by user ID."""
    return db.query(models.EmployerProfile).filter(models.EmployerProfile.user_id == user_id).first()

def update_employer_profile(db: Session, user_id: int, profile_update: schemas.EmployerProfileUpdate):
    """Update an employer's profile."""
    db_profile = db.query(models.EmployerProfile).filter(models.EmployerProfile.user_id == user_id).first()
    if not db_profile:
        return None

    update_data = profile_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_profile, key, value)

    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

# --- Internship CRUD Operations ---

def get_internship(db: Session, internship_id: int):
    """Retrieve an internship by ID."""
    return db.query(models.Internship).filter(models.Internship.id == internship_id).first()

def get_internships(db: Session, skip: int = 0, limit: int = 100, employer_id: int = None, search_query: str = None):
    """Retrieve a list of internships, optionally filtered by employer or search query."""
    query = db.query(models.Internship)
    if employer_id:
        query = query.filter(models.Internship.employer_id == employer_id)
    if search_query:
        # Simple search across title, description, location
        query = query.filter(
            or_(
                models.Internship.title.ilike(f"%{search_query}%"),
                models.Internship.description.ilike(f"%{search_query}%"),
                models.Internship.location.ilike(f"%{search_query}%")
            )
        )
    return query.offset(skip).limit(limit).all()

def create_internship(db: Session, internship: schemas.InternshipCreate, employer_id: int):
    """Create a new internship for a given employer."""
    db_internship = models.Internship(**internship.model_dump(), employer_id=employer_id)
    db.add(db_internship)
    db.commit()
    db.refresh(db_internship)
    return db_internship

def update_internship(db: Session, internship_id: int, internship_update: schemas.InternshipUpdate):
    """Update an existing internship."""
    db_internship = db.query(models.Internship).filter(models.Internship.id == internship_id).first()
    if not db_internship:
        return None

    update_data = internship_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_internship, key, value)

    db.add(db_internship)
    db.commit()
    db.refresh(db_internship)
    return db_internship

def delete_internship(db: Session, internship_id: int):
    """Delete an internship by ID."""
    db_internship = db.query(models.Internship).filter(models.Internship.id == internship_id).first()
    if db_internship:
        db.delete(db_internship)
        db.commit()
        return True
    return False

# --- Application CRUD Operations ---

def get_application(db: Session, application_id: int):
    """Retrieve an application by ID."""
    return db.query(models.Application).filter(models.Application.id == application_id).first()

def get_applications_by_internship(db: Session, internship_id: int, skip: int = 0, limit: int = 100):
    """Retrieve applications for a specific internship."""
    return db.query(models.Application).filter(models.Application.internship_id == internship_id).offset(skip).limit(limit).all()

def get_applications_by_student(db: Session, student_id: int, skip: int = 0, limit: int = 100):
    """Retrieve applications made by a specific student."""
    return db.query(models.Application).filter(models.Application.student_id == student_id).offset(skip).limit(limit).all()

def create_application(db: Session, application: schemas.ApplicationCreate, student_id: int):
    """Create a new application for an internship by a student."""
    # Check if student has already applied to this internship
    existing_application = db.query(models.Application).filter(
        models.Application.internship_id == application.internship_id,
        models.Application.student_id == student_id
    ).first()
    if existing_application:
        return None # Indicate that application already exists

    db_application = models.Application(
        internship_id=application.internship_id,
        student_id=student_id,
        cover_letter=application.cover_letter,
        status=application.status
    )
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application

def update_application_status(db: Session, application_id: int, new_status: str):
    """Update the status of an application."""
    db_application = db.query(models.Application).filter(models.Application.id == application_id).first()
    if not db_application:
        return None
    db_application.status = new_status
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application

def delete_application(db: Session, application_id: int):
    """Delete an application by ID."""
    db_application = db.query(models.Application).filter(models.Application.id == application_id).first()
    if db_application:
        db.delete(db_application)
        db.commit()
        return True
    return False

def set_user_otp(db: Session, user: models.User, otp: str):
    """Sets the OTP and expiration for a user."""
    user.otp = otp
    user.otp_expires_at = datetime.now(timezone.utc) + timedelta(minutes=10) # OTP valid for 10 minutes
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def reset_user_password(db: Session, user: models.User, new_password: str):
    """Resets the user's password."""
    user.hashed_password = get_password_hash(new_password)
    user.otp = None
    user.otp_expires_at = None
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def verify_user(db: Session, user: models.User):
    """Marks a user as verified."""
    user.is_verified = True
    user.otp = None
    user.otp_expires_at = None
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

