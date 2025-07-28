import React, { useState, useEffect } from "react";
import { Card, Row, Col, Badge, Button, Spinner, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { fetchApplicantProfile, fetchUserById } from "../api"; // Import necessary API functions
import "./ApplicantProfile.css";

const ApplicantProfile = () => {
  const { applicantId } = useParams();
  const navigate = useNavigate();

  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadApplicantData = async () => {
      if (!applicantId) {
        setError("No applicant ID provided.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Fetch user details (name, email) and profile details (skills, etc.) simultaneously
        const [userData, profileData] = await Promise.all([
          fetchUserById(applicantId),
          fetchApplicantProfile(applicantId),
        ]);

        // Combine both results into a single applicant object
        setApplicant({
          name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
          email: userData.email,
          mobile: userData.phone_number || "N/A",
          university: profileData.education || "N/A",
          skills: profileData.skills ? profileData.skills.split(',').map(s => s.trim()) : [],
          resume: profileData.resume_url || "#",
        });

      } catch (err) {
        console.error("Error fetching applicant data:", err);
        setError("Failed to load applicant profile.");
      } finally {
        setLoading(false);
      }
    };

    loadApplicantData();
  }, [applicantId]);

  if (loading) {
    return <div className="text-center p-5"><Spinner animation="border" /></div>;
  }

  if (error) {
    return <Alert variant="danger" className="m-3">{error}</Alert>;
  }

  if (!applicant) {
    return <Alert variant="warning" className="m-3">Applicant data could not be loaded.</Alert>;
  }

  return (
    <div className="applicant-profile-container">
      <Card className="applicant-profile-card">
        <h2 className="profile-heading">Applicant Profile</h2>

        <Row>
          <Col md={6}>
            <h4>{applicant.name}</h4>
            <p><strong>Email:</strong> {applicant.email}</p>
            <p><strong>Mobile:</strong> {applicant.mobile}</p>
            <p><strong>University:</strong> {applicant.university}</p>
          </Col>

          <Col md={6}>
            <p>
              <strong>Resume:</strong>{" "}
              <a href={applicant.resume} target="_blank" rel="noopener noreferrer">
                View Resume
              </a>
            </p>
          </Col>
        </Row>

        <hr />

        <h5>Skills</h5>
        <div className="skills-container">
          {applicant.skills.length > 0 ? (
            applicant.skills.map((skill, index) => (
              <Badge key={index} bg="info" className="skill-badge">{skill}</Badge>
            ))
          ) : (
            <p>No skills listed.</p>
          )}
        </div>

        <div className="action-buttons">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Back to Applicants
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ApplicantProfile;
