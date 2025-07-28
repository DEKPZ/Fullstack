# backend/main.py

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
        # This will fail if the database connection is not established or table doesn't exist
        first_user = db.query(models.User).first()
        if first_user:
            return {"message": "Database connection successful!", "first_user_email": first_user.email}
        else:
            return {"message": "Database connection successful! No users found yet."}
    except Exception as e:
        # If any error occurs during the database operation, it means the connection failed
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
    profile = crud.get_student_profile(db, user_id=current_user.id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Student profile not found")
    return profile

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
    return profile

@app.get("/applicants/{user_id}/profile", response_model=schemas.StudentProfileResponse)
def read_applicant_profile(
    user_id: int,
    current_user: models.User = Depends(auth.get_current_active_employer), # Only employers can view applicant profiles
    db: Session = Depends(get_db)
):
    """Get a specific applicant's profile by user ID (Employer only)."""
    user = crud.get_user(db, user_id=user_id)
    if not user or user.role != "student":
        raise HTTPException(status_code=404, detail="Applicant (student) not found")
    profile = crud.get_student_profile(db, user_id=user_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Student profile not found for this applicant")
    return profile


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

@app.post("/internships/{internship_id}/apply", response_model=schemas.ApplicationResponse, status_code=status.HTTP_201_CREATED)
def apply_for_internship(
    internship_id: int,
    application: schemas.ApplicationBase, # Uses base for cover_letter and initial status
    current_user: models.User = Depends(auth.get_current_active_student),
    db: Session = Depends(get_db)
):
    """Student applies for an internship."""
    internship = crud.get_internship(db, internship_id=internship_id)
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    # Create a new ApplicationCreate schema with the internship_id
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

    # Ensure the employer owns the internship associated with this application
    internship = crud.get_internship(db, internship_id=application.internship_id)
    if not internship or internship.employer_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this application's status")

    updated_application = crud.update_application_status(db, application_id=application_id, new_status=new_status)
    return updated_application

@app.get("/hired-interns", response_model=List[schemas.ApplicationResponse])
def get_hired_interns(
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(auth.get_current_active_employer),
    db: Session = Depends(get_db)
):
    """Get a list of interns hired by the current employer."""
    # This assumes 'hired' is a status in the Application model
    # We need to get applications for the employer's internships that are 'hired'
    employer_internships = crud.get_internships(db, employer_id=current_user.id)
    hired_applications = []
    for internship in employer_internships:
        applications = crud.get_applications_by_internship(db, internship_id=internship.id)
        hired_applications.extend([app for app in applications if app.status == "hired"])

    # Basic pagination for the combined list
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
