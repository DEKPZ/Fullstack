import React, { useState, useEffect } from "react";
import { Card, Button, Form, Row, Col, Spinner, Alert, ProgressBar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  fetchCurrentUser,
  fetchMyStudentProfile,
  updateMyStudentProfile,
} from "../api";
import "./ProfilePage.css";

const steps = ['Personal Info', 'Education', 'Experience', 'Projects', 'Skills', 'Certifications', 'Preferences'];

// Helper to safely parse JSON data from the backend
const safeJsonParse = (jsonString, defaultValue) => {
  if (!jsonString || typeof jsonString !== 'string') return defaultValue;
  try {
    const parsed = JSON.parse(jsonString);
    // Ensure sections that expect an array get one, even if the stored data is null/malformed
    if (Array.isArray(defaultValue) && !Array.isArray(parsed)) {
      return defaultValue;
    }
    return parsed;
  } catch (e) {
    return defaultValue;
  }
};

const ProfilePage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        const currentUser = await fetchCurrentUser();
        const studentProfile = await fetchMyStudentProfile();

        setProfileData({
          // User fields
          first_name: currentUser.first_name || '',
          last_name: currentUser.last_name || '',
          email: currentUser.email || '',
          phone_number: currentUser.phone_number || '',
          bio: currentUser.bio || '',
          // Profile fields (safely parsed)
          education: safeJsonParse(studentProfile.education, [{ degree: '', institution: '', duration: '', cgpa: '' }]),
          experience: safeJsonParse(studentProfile.experience, [{ role: '', company: '', duration: '', responsibilities: '' }]),
          projects: safeJsonParse(studentProfile.projects, [{ name: '', description: '', tools: '' }]),
          certifications: safeJsonParse(studentProfile.certifications, [{ name: '', issuer: '', date: '' }]),
          skills: studentProfile.skills || '',
          career_goals: studentProfile.career_goals || '',
          internship_preferences: studentProfile.internship_preferences || '',
          github_link: studentProfile.github_link || '',
          linkedin_profile: studentProfile.linkedin_profile || '',
          resume_url: studentProfile.resume_url || '',
          portfolio_url: studentProfile.portfolio_url || '',
        });
      } catch (err) {
        console.error("Error loading profile data:", err);
        setError("Failed to load profile. Please ensure you are logged in as a student and try again.");
      } finally {
        setLoading(false);
      }
    };
    loadProfileData();
  }, []);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSectionChange = (section, index, e) => {
    const { name, value } = e.target;
    const updatedSection = [...profileData[section]];
    updatedSection[index][name] = value;
    setProfileData(prev => ({ ...prev, [section]: updatedSection }));
  };

  const addSectionItem = (section, newItem) => {
    setProfileData(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), newItem]
    }));
  };

  const removeSectionItem = (section, index) => {
    const updatedSection = profileData[section].filter((_, i) => i !== index);
    setProfileData(prev => ({ ...prev, [section]: updatedSection }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      // Prepare data for the backend, stringifying complex fields
      const payload = {
        ...profileData,
        education: JSON.stringify(profileData.education.filter(e => e.degree)),
        experience: JSON.stringify(profileData.experience.filter(e => e.role)),
        projects: JSON.stringify(profileData.projects.filter(p => p.name)),
        certifications: JSON.stringify(profileData.certifications.filter(c => c.name)),
      };

      // Remove user-specific fields that are not part of the StudentProfileUpdate schema
      delete payload.first_name;
      delete payload.last_name;
      delete payload.email;
      delete payload.phone_number;
      delete payload.bio;

      await updateMyStudentProfile(payload);
      alert("Profile updated successfully!");
      navigate("/my-profile");
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile. Please check your data and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderStepContent = () => {
    // Common props for all step components
    const stepProps = {
      data: profileData,
      handleChange,
      handleSectionChange,
      addSectionItem,
      removeSectionItem
    };

    switch (steps[currentStep]) {
      case 'Personal Info': return <PersonalInfoStep {...stepProps} />;
      case 'Education': return <DynamicSectionStep {...stepProps} section="education" fields={{ degree: 'Degree', institution: 'Institution', duration: 'Duration', cgpa: 'CGPA' }} title="Education" />;
      case 'Experience': return <DynamicSectionStep {...stepProps} section="experience" fields={{ role: 'Role', company: 'Company', duration: 'Duration', responsibilities: 'Responsibilities' }} title="Work Experience" isTextarea="responsibilities" />;
      case 'Projects': return <DynamicSectionStep {...stepProps} section="projects" fields={{ name: 'Project Name', description: 'Description', tools: 'Technologies Used' }} title="Projects" isTextarea="description" />;
      case 'Skills': return <SkillsStep {...stepProps} />;
      case 'Certifications': return <DynamicSectionStep {...stepProps} section="certifications" fields={{ name: 'Certification Name', issuer: 'Issuing Body', date: 'Date Awarded' }} title="Certifications" />;
      case 'Preferences': return <PreferencesStep {...stepProps} />;
      default: return null;
    }
  };

  if (loading) return <div className="text-center p-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger" className="m-3">{error}</Alert>;
  if (!profileData) return <Alert variant="warning" className="m-3">Could not load profile data.</Alert>;

  return (
    <div className="profile-builder-container">
      <Card className="profile-builder-card">
        <h2 className="profile-title">Build Your Profile</h2>
        <p className="profile-subtitle">A complete profile attracts more opportunities</p>

        <div className="progress-container">
          <ProgressBar now={((currentStep + 1) / steps.length) * 100} label={`${steps[currentStep]}`} />
        </div>

        <Form className="step-content">
          {renderStepContent()}
        </Form>

        <div className="step-navigation">
          {currentStep > 0 && <Button variant="secondary" onClick={handlePrev}>Previous</Button>}
          {currentStep < steps.length - 1 && <Button variant="primary" onClick={handleNext}>Next</Button>}
          {currentStep === steps.length - 1 && (
            <Button variant="success" onClick={handleSave} disabled={isSaving}>
              {isSaving ? <><Spinner as="span" animation="border" size="sm" /> Saving...</> : 'Save Profile'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

// --- Step Components ---

const PersonalInfoStep = ({ data, handleChange }) => (
  <>
    <Row>
      <Col md={6}><Form.Group className="mb-3"><Form.Label>First Name</Form.Label><Form.Control type="text" name="first_name" value={data.first_name} onChange={handleChange} disabled /></Form.Group></Col>
      <Col md={6}><Form.Group className="mb-3"><Form.Label>Last Name</Form.Label><Form.Control type="text" name="last_name" value={data.last_name} onChange={handleChange} disabled /></Form.Group></Col>
    </Row>
    <Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" name="email" value={data.email} disabled /></Form.Group>
    <Form.Group className="mb-3"><Form.Label>Bio / Professional Summary</Form.Label><Form.Control as="textarea" rows={3} name="bio" value={data.bio} onChange={handleChange} placeholder="A short summary about you..." /></Form.Group>
    <Row>
      <Col md={6}><Form.Group className="mb-3"><Form.Label>GitHub Profile URL</Form.Label><Form.Control type="url" name="github_link" value={data.github_link} onChange={handleChange} placeholder="https://github.com/username" /></Form.Group></Col>
      <Col md={6}><Form.Group className="mb-3"><Form.Label>LinkedIn Profile URL</Form.Label><Form.Control type="url" name="linkedin_profile" value={data.linkedin_profile} onChange={handleChange} placeholder="https://linkedin.com/in/username" /></Form.Group></Col>
    </Row>
  </>
);

const DynamicSectionStep = ({ data, section, fields, title, isTextarea, handleSectionChange, addSectionItem, removeSectionItem }) => {
  const newItem = Object.keys(fields).reduce((acc, key) => ({ ...acc, [key]: '' }), {});
  return (
    <>
      <h4>{title}</h4>
      {data[section] && data[section].map((item, index) => (
        <div key={index} className="form-section">
          <Row>
            {Object.entries(fields).map(([fieldName, fieldLabel]) => (
              <Col md={fieldName === 'responsibilities' || fieldName === 'description' ? 12 : 6} key={fieldName}>
                <Form.Group className="mb-2">
                  <Form.Label>{fieldLabel}</Form.Label>
                  <Form.Control
                    as={isTextarea === fieldName ? "textarea" : "input"}
                    rows={isTextarea === fieldName ? 3 : undefined}
                    type="text"
                    name={fieldName}
                    value={item[fieldName] || ''}
                    onChange={(e) => handleSectionChange(section, index, e)}
                  />
                </Form.Group>
              </Col>
            ))}
          </Row>
          <Button variant="outline-danger" size="sm" onClick={() => removeSectionItem(section, index)}>Remove</Button>
        </div>
      ))}
      <Button variant="outline-primary" className="mt-2" onClick={() => addSectionItem(section, newItem)}>+ Add {title.slice(0, -1)}</Button>
    </>
  );
};

const SkillsStep = ({ data, handleChange }) => (
  <>
    <h4>Skills</h4>
    <Form.Group className="mb-3">
      <Form.Label>Technical Skills</Form.Label>
      <Form.Control
        as="textarea"
        rows={4}
        name="skills"
        value={data.skills}
        onChange={handleChange}
        placeholder="Enter your skills, separated by commas (e.g., Python, React, SQL, Git)"
      />
      <Form.Text>This is crucial for our recommendation engine to find the best matches for you.</Form.Text>
    </Form.Group>
  </>
);

const PreferencesStep = ({ data, handleChange }) => (
  <>
    <h4>Career & Internship Preferences</h4>
    <Form.Group className="mb-3">
      <Form.Label>Career Goals</Form.Label>
      <Form.Control
        as="textarea"
        rows={4}
        name="career_goals"
        value={data.career_goals}
        onChange={handleChange}
        placeholder="Describe your long-term career aspirations. What kind of impact do you want to make?"
      />
    </Form.Group>
    <Form.Group className="mb-3">
      <Form.Label>Internship Preferences</Form.Label>
      <Form.Control
        as="textarea"
        rows={3}
        name="internship_preferences"
        value={data.internship_preferences}
        onChange={handleChange}
        placeholder="What are you looking for in an internship? (e.g., Preferred locations like 'Remote' or 'New York', internship types like 'Software Engineering, Data Science', company size, etc.)"
      />
    </Form.Group>
  </>
);

export default ProfilePage; 
