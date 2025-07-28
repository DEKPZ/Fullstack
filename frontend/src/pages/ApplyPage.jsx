import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Badge, Alert, Card, Spinner } from "react-bootstrap";
import { fetchInternshipDetail, applyToInternship, fetchCurrentUser } from "../api"; // 1. Import API functions
import "./ApplyPage.css";

const ApplyPage = () => {
  const { id } = useParams(); // Internship ID from URL
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    cover_letter: "", // 2. Changed to match backend schema
  });
  const [submissionMessage, setSubmissionMessage] = useState(null);

  useEffect(() => {
    const loadPageData = async () => {
      try {
        setLoading(true);
        // Fetch both internship details and current user info
        const internshipData = await fetchInternshipDetail(id);
        const userData = await fetchCurrentUser();
        setInternship(internshipData);
        setCurrentUser(userData);
      } catch (err) {
        console.error("Error loading page data:", err);
        setError("Failed to load page details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmissionMessage(null);

    try {
      // 3. The data now matches the ApplicationBase schema
      const applicationData = {
        cover_letter: formData.cover_letter,
        status: "pending",
      };
      
      await applyToInternship(id, applicationData); // 4. Use the centralized API function

      setSubmissionMessage({ type: "success", text: "Application submitted successfully!" });
      setTimeout(() => navigate('/interns'), 2000); // Redirect to dashboard after 2 seconds

    } catch (err) {
      console.error("Error submitting application:", err);
      const errorMessage = err.response?.data?.detail || "Failed to submit application.";
      setSubmissionMessage({ type: "danger", text: errorMessage });
    } finally {
        setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) return <Alert variant="danger" className="m-3">{error}</Alert>;
  if (!internship || !currentUser) return <Alert variant="warning" className="m-3">Could not load required data.</Alert>;

  return (
    <div className="apply-container">
      <Card>
        <Card.Header as="h2" className="apply-header">
          Apply for {internship.title}
        </Card.Header>
        <Card.Body>
          <div className="apply-details mb-4">
            {/* 5. Displaying requirements from the backend */}
            <p><strong>Skills Required:</strong> {internship.requirements || "N/A"}</p>
            <p><strong>Location:</strong> {internship.location}</p>
            <p><strong>Duration:</strong> {internship.duration || "N/A"}</p>
            <p><strong>Stipend:</strong> {internship.stipend || "N/A"}</p>
          </div>

          <Alert variant="info">
            You are applying as: <strong>{currentUser.first_name} {currentUser.last_name}</strong> ({currentUser.email})
          </Alert>

          {submissionMessage && (
            <Alert variant={submissionMessage.type} className="mb-4">
              {submissionMessage.text}
            </Alert>
          )}

          <Form className="apply-form" onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formCoverLetter">
              <Form.Label>Cover Letter (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                name="cover_letter" // 6. Name matches state and backend schema
                rows={5}
                placeholder="Briefly explain why you're a good fit for this role..."
                value={formData.cover_letter}
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading} className="w-100">
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ApplyPage;