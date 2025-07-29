import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { fetchEmployerInternships } from "../api";
import "./MyInternships.css"; // We will create this CSS file next

const MyInternships = () => {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMyInternships = async () => {
      try {
        setLoading(true);
        const data = await fetchEmployerInternships();
        setInternships(data);
      } catch (err) {
        console.error("Error fetching employer internships:", err);
        setError("Failed to load your internships. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadMyInternships();
  }, []);

  if (loading) {
    return <div className="loading text-center p-5"><Spinner animation="border" /></div>;
  }

  return (
    <div className="my-internships-container">
      <h2 className="my-internships-title">My Posted Internships</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Container>
        <Row>
          {internships.length > 0 ? (
            internships.map((internship) => (
              <Col md={6} lg={4} key={internship.id} className="mb-4">
                <Card className="my-internships-card">
                  <Card.Body>
                    <Card.Title className="my-internships-job-title">{internship.title}</Card.Title>
                    <div className="my-internships-details">
                      <p><strong>Location:</strong> {internship.location}</p>
                      <p><strong>Status:</strong> {internship.is_active ? "Active" : "Inactive"}</p>
                      <p><strong>Posted On:</strong> {new Date(internship.posted_date).toLocaleDateString()}</p>
                    </div>
                    <Button 
                      className="my-internships-action-button" 
                      onClick={() => navigate(`/view-applicants/${internship.id}`)}
                    >
                      View Applicants
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <Alert variant="info" className="text-center">You have not posted any internships yet.</Alert>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default MyInternships;