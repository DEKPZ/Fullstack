import React, { useState, useEffect } from "react";
import { Card, Button, Badge, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { fetchInternships } from "../api"; // 1. Import your API function
import "./Internships.css";

const InternshipsPage = () => { 
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInternships = async () => {
      try {
        const data = await fetchInternships();
        setInternships(data);
      } catch (err) {
        console.error("Error fetching internships:", err);
        setError("Failed to fetch internships. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadInternships();
  }, []);

  const handleApply = (id) => {
    // This navigation is correct and will take the user to the application form
    navigate(`/apply/${id}`);
  };

  if (loading) {
    return <div className="loading text-center p-5">Loading...</div>;
  }

  if (error) {
    return <div className="error text-center p-5">{error}</div>;
  }

  return (
    <div className="internship-container">
      <h2 className="internship-title">Available Internships</h2>
      <Container>
        <Row>
          {internships.map((internship) => (
            <Col md={6} lg={4} key={internship.id} className="mb-4">
              <Card className="internship-card">
                <Card.Body>
                  <Card.Title className="internship-job-title">{internship.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {/* Placeholder for a more descriptive company name */}
                    Company ID: {internship.employer_id}
                  </Card.Subtitle>
                  <div className="internship-details">
                    <p><strong>Location:</strong> {internship.location}</p>
                    <p><strong>Duration:</strong> {internship.duration || "N/A"}</p>
                    <p><strong>Stipend:</strong> {internship.stipend || "N/A"}</p>
                    <div className="internship-skills">
                      <strong>Skills Required:</strong>
                      <div className="skills-badge-container mt-1">
                        {internship.skills_required ? (
                          internship.skills_required.split(',').map((skill, index) => (
                            <Badge pill bg="primary" key={index} className="me-1 mb-1 skill-badge">
                              {skill.trim()}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted">Not specified</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button className="internship-apply-button" onClick={() => handleApply(internship.id)}>
                    Apply Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default InternshipsPage;