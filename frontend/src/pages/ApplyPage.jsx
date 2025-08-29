import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Badge, Alert, Card, Spinner, Modal } from "react-bootstrap";
import {
  fetchInternshipDetail,
  applyToInternship,
  fetchCurrentUser,
  upgradeToPremium,
  topUpOneCredit
} from "../api";
import "./ApplyPage.css";

// This modal appears when a user is out of credits.
const UpgradeModal = ({ show, onHide, internshipTitle }) => {
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [isToppingUp, setIsToppingUp] = useState(false);

    const handleUpgrade = async () => {
        setIsUpgrading(true);
        try {
            await upgradeToPremium();
            alert("Successfully upgraded to Premium! You now have unlimited applications.");
            onHide();
            window.location.reload();
        } catch (error) {
            alert("There was an error upgrading your account. Please try again.");
            console.error(error);
        } finally {
            setIsUpgrading(false);
        }
    };

    const handleTopUp = async () => {
        setIsToppingUp(true);
        try {
            await topUpOneCredit();
            alert("Successfully purchased 1 credit! You can now complete your application.");
            onHide();
            window.location.reload();
        } catch (error) {
            alert("There was an error purchasing a credit. Please try again.");
            console.error(error);
        } finally {
            setIsToppingUp(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Out of Credits</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>You don't have enough credits to apply for **{internshipTitle}**.</p>
                <p>Choose an option below to continue your application.</p>
                <div className="d-grid gap-2 mt-4">
                    <Button variant="success" onClick={handleUpgrade} disabled={isUpgrading}>
                        {isUpgrading ? "Processing..." : "Upgrade to Premium (₹199)"}
                    </Button>
                    <Button variant="primary" onClick={handleTopUp} disabled={isToppingUp}>
                        {isToppingUp ? "Processing..." : "Buy 1 Credit (₹99)"}
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};


const ApplyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [formData, setFormData] = useState({
    cover_letter: "",
  });
  const [submissionMessage, setSubmissionMessage] = useState(null);

  useEffect(() => {
    const loadPageData = async () => {
      try {
        setLoading(true);
        const internshipData = await fetchInternshipDetail(id);
        const userData = await fetchCurrentUser();
        setInternship(internshipData);
        setCurrentUser(userData);
      } catch (err) {
        console.error("Error loading page data:", err);
        setError("Failed to load page details. Please log in and try again.");
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
      const applicationData = {
        cover_letter: formData.cover_letter,
        status: "pending",
      };
      
      await applyToInternship(id, applicationData);

      setSubmissionMessage({ type: "success", text: "Application submitted successfully!" });
      setTimeout(() => navigate('/interns'), 2000);

    } catch (err) {
      console.error("Error submitting application:", err);
      const errorMessage = err.response?.data?.detail || "Failed to submit application.";
      
      if (errorMessage.includes("enough credits")) {
        setSubmissionMessage({ type: "danger", text: errorMessage });
        setShowUpgradeModal(true);
      } else {
        setSubmissionMessage({ type: "danger", text: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !internship) {
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
    <>
      <div className="apply-container">
        <Card>
          <Card.Header as="h2" className="apply-header">
            Apply for {internship.title}
          </Card.Header>
          <Card.Body>
            <div className="apply-details mb-4">
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
                  name="cover_letter"
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

      <UpgradeModal
        show={showUpgradeModal}
        onHide={() => setShowUpgradeModal(false)}
        internshipTitle={internship?.title}
      />
    </>
  );
};

export default ApplyPage;