import React, { useState, useEffect } from "react";
import { Card, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import {
  fetchCurrentUser,
  fetchMyStudentProfile,
  updateMyStudentProfile,
  fetchMyEmployerProfile,
  updateMyEmployerProfile
} from "../api"; // 1. Import all necessary API functions
import "./ProfilePage.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Load all necessary data on component mount
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);

        let profileData;
        if (currentUser.role === 'student') {
          profileData = await fetchMyStudentProfile();
        } else if (currentUser.role === 'employer') {
          profileData = await fetchMyEmployerProfile();
        }
        setProfile(profileData);

        // 3. Initialize form with combined data from both user and profile
        setFormData({
            first_name: currentUser.first_name || '',
            last_name: currentUser.last_name || '',
            email: currentUser.email || '',
            phone_number: currentUser.phone_number || '',
            address: currentUser.address || '',
            bio: currentUser.bio || '',
            // Profile-specific fields
            ...profileData,
        });

      } catch (err) {
        console.error("Error loading profile data:", err);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadProfileData();
  }, []);

  const handleEditToggle = () => {
    // Reset form data to original state when cancelling
    if (editMode) {
        setFormData({
            first_name: user.first_name,
            last_name: user.last_name,
            ...profile
        });
    }
    setEditMode(!editMode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 4. Implement the save functionality
  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      if (user.role === 'student') {
        // Prepare data for StudentProfileUpdate schema
        const profileUpdateData = {
          education: formData.education,
          skills: formData.skills,
          experience: formData.experience,
          resume_url: formData.resume_url,
          portfolio_url: formData.portfolio_url
        };
        await updateMyStudentProfile(profileUpdateData);

      } else if (user.role === 'employer') {
        // Prepare data for EmployerProfileUpdate schema
        const profileUpdateData = {
          company_name: formData.company_name,
          company_description: formData.company_description,
          website: formData.website,
          industry: formData.industry,
        };
        await updateMyEmployerProfile(profileUpdateData);
      }
      
      // Note: You might also need a general user update endpoint for name, email etc.
      // For now, we assume only profile-specific fields are being saved.

      setEditMode(false);
      alert("Profile updated successfully!");

    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) { // Show initial loading spinner
    return <div className="text-center p-5"><Spinner animation="border" /></div>;
  }

  if (error) {
    return <Alert variant="danger" className="m-3">{error}</Alert>;
  }

  // 5. Render different form fields based on the user's role
  const renderProfileFields = () => {
    if (user.role === 'student') {
      return (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Education</Form.Label>
            <Form.Control type="text" name="education" value={formData.education || ''} onChange={handleChange} disabled={!editMode} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Skills (Comma-separated)</Form.Label>
            <Form.Control type="text" name="skills" value={formData.skills || ''} onChange={handleChange} disabled={!editMode} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Experience</Form.Label>
            <Form.Control as="textarea" name="experience" value={formData.experience || ''} onChange={handleChange} disabled={!editMode} />
          </Form.Group>
        </>
      );
    } else if (user.role === 'employer') {
      return (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Company Name</Form.Label>
            <Form.Control type="text" name="company_name" value={formData.company_name || ''} onChange={handleChange} disabled={!editMode} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Industry</Form.Label>
            <Form.Control type="text" name="industry" value={formData.industry || ''} onChange={handleChange} disabled={!editMode} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Company Website</Form.Label>
            <Form.Control type="text" name="website" value={formData.website || ''} onChange={handleChange} disabled={!editMode} />
          </Form.Group>
        </>
      );
    }
    return null;
  };

  return (
    <div className="profile-container">
      <Card className="profile-card">
        <h2 className="profile-title">My Profile ({user?.role})</h2>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" name="first_name" value={formData.first_name || ''} onChange={handleChange} disabled={!editMode} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" name="last_name" value={formData.last_name || ''} onChange={handleChange} disabled={!editMode} />
              </Form.Group>
            </Col>
          </Row>
           <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={formData.email || ''} onChange={handleChange} disabled />
              </Form.Group>
            </Col>
            <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="text" name="phone_number" value={formData.phone_number || ''} onChange={handleChange} disabled={!editMode} />
                </Form.Group>
            </Col>
          </Row>

          <hr/>
          
          {renderProfileFields()}
          
          <div className="button-group">
            {!editMode ? (
              <Button onClick={handleEditToggle}>Edit Profile</Button>
            ) : (
              <>
                <Button variant="success" onClick={handleSave} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="secondary" onClick={handleEditToggle}>
                  Cancel
                </Button>
              </>
            )}
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ProfilePage;