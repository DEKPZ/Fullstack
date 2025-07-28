import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, ListGroup, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import { FaSuitcase, FaBell, FaUsers, FaTools, FaFileAlt, FaUser } from "react-icons/fa";
import { fetchMyApplications, fetchInternships, fetchInternshipDetail } from "../api";
import "./InternsDashboard.css";

const InternsDashboard = () => {
  const navigate = useNavigate(); // 2. Initialize the navigate function
  const [applications, setApplications] = useState([]);
  const [recommendedInternships, setRecommendedInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const myApplications = await fetchMyApplications();
        const applicationsWithDetails = await Promise.all(
          myApplications.map(async (app) => {
            const internshipDetails = await fetchInternshipDetail(app.internship_id);
            return { ...app, internship: internshipDetails };
          })
        );
        setApplications(applicationsWithDetails);

        const allInternships = await fetchInternships();
        setRecommendedInternships(allInternships.slice(0, 5));
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApplyClick = (internshipId) => {
    navigate(`/apply/${internshipId}`);
  };

  if (loading) {
    return <div className="loading text-center p-5">Loading Dashboard...</div>;
  }

  if (error) {
    return <div className="error text-center p-5">{error}</div>;
  }

  return (
    <div className="dashboard-page">
      {/* Sidebar */}
      <div className="sidebar">
        <ListGroup variant="flush">
          {/* 3. Add onClick to navigate to the profile page */}
          <Button className="sidebar-btn" onClick={() => navigate('/profile')}><FaUser /> Profile</Button>
          <Button className="sidebar-btn"><FaSuitcase /> My Applications</Button>
          <Button className="sidebar-btn" onClick={() => navigate('/build-resume')}><FaFileAlt /> Resume & Cover Letter</Button>
          <Button className="sidebar-btn"><FaTools /> Skill Development</Button>
          <Button className="sidebar-btn"><FaUsers /> Community</Button>
          <Button className="sidebar-btn"><FaBell /> Notifications</Button>
        </ListGroup>
      </div>

      {/* Main Dashboard */}
      <Container fluid className="dashboard-container">
        <Row>
          {/* My Applications */}
          <Col md={7}>
            <h4>My Applications</h4>
            <Card className="internship-card">
              <Card.Body>
                <ListGroup>
                  {applications.length > 0 ? (
                    applications.map((app) => (
                      <ListGroup.Item key={app.id} className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{app.internship.title}</strong>
                          <p className="mb-0 text-muted">Company ID: {app.internship.employer_id}</p>
                          <small>Applied on: {new Date(app.applied_date).toLocaleDateString()}</small>
                        </div>
                        <Badge bg="info" pill>
                          {app.status}
                        </Badge>
                      </ListGroup.Item>
                    ))
                  ) : (
                    <div className="text-center p-3">You have not applied to any internships yet.</div>
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          {/* Recommended Internships */}
          <Col md={5}>
            <h4>Recommended Internships</h4>
            <Card className="internship-card">
              <Card.Body>
                <ListGroup>
                  {recommendedInternships.map((intern) => (
                    <ListGroup.Item key={intern.id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{intern.title}</strong>
                        <p className="mb-0 text-muted">{intern.location}</p>
                      </div>
                      {/* 4. Add onClick to navigate to the apply page */}
                      <Button variant="outline-success" size="sm" onClick={() => handleApplyClick(intern.id)}>
                        Apply
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default InternsDashboard;
