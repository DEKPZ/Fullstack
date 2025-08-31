import React, { useState, useEffect } from "react";
import { Card, Button, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  fetchCurrentUser,
  fetchMyEmployerProfile,
  updateMyEmployerProfile,
} from "../api";
import "./EmployerProfilepage.css"; 

const EmployerProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        const currentUser = await fetchCurrentUser();
        const employerProfile = await fetchMyEmployerProfile();

        setUserData(currentUser);
        setProfileData({
          company_name: employerProfile.company_name || '',
          company_description: employerProfile.company_description || '',
          website: employerProfile.website || '',
          industry: employerProfile.industry || '',
        });
      } catch (err) {
        console.error("Error loading employer profile data:", err);
        setError("Failed to load profile. Please ensure you are logged in as an employer.");
      } finally {
        setLoading(false);
      }
    };
    loadProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await updateMyEmployerProfile(profileData);
      alert("Profile updated successfully!");
      navigate("/employer"); 
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile. Please check your data and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="text-center p-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger" className="m-3">{error}</Alert>;
  if (!profileData || !userData) return <Alert variant="warning" className="m-3">Could not load profile data.</Alert>;

  return (
    <div className="profile-builder-container">
      <Card className="profile-builder-card">
        <h2 className="profile-title">Edit Company Profile</h2>
        <p className="profile-subtitle">Keep your company's information up to date.</p>

        <Form className="step-content">
          <h4>Company Information</h4>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Company Name</Form.Label>
                <Form.Control 
                  type="text" 
                  name="company_name" 
                  value={profileData.company_name} 
                  onChange={handleChange} 
                />
              </Form.Group>
            </Col>
            <Col md={6}>
               <Form.Group className="mb-3">
                <Form.Label>Industry</Form.Label>
                <Form.Control 
                  type="text" 
                  name="industry" 
                  value={profileData.industry} 
                  onChange={handleChange}
                  placeholder="e.g., Information Technology"
                />
              </Form.Group>
            </Col>
          </Row>
           <Form.Group className="mb-3">
            <Form.Label>Company Website</Form.Label>
            <Form.Control 
              type="url" 
              name="website" 
              value={profileData.website} 
              onChange={handleChange}
              placeholder="https://www.example.com"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Company Description</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={4} 
              name="company_description" 
              value={profileData.company_description} 
              onChange={handleChange}
              placeholder="Describe your company, its mission, and culture."
            />
          </Form.Group>
          
          <h4 className="mt-4">Contact Person Details</h4>
           <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Contact Name</Form.Label>
                <Form.Control 
                  type="text" 
                  value={`${userData.first_name} ${userData.last_name}`}
                  disabled 
                />
              </Form.Group>
            </Col>
             <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Contact Email</Form.Label>
                <Form.Control 
                  type="email" 
                  value={userData.email}
                  disabled 
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>

        <div className="step-navigation">
           <Button variant="secondary" onClick={() => navigate('/employer')}>Cancel</Button>
           <Button variant="success" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <><Spinner as="span" animation="border" size="sm" /> Saving...</> : 'Save Profile'}
          </Button>
        </div>
      </Card>
    </div>
  );
};
// To this corrected line
export default EmployerProfilePage;