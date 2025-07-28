import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Sample stats (replace with API data)
  const stats = {
    totalInterns: 120,
    totalEmployers: 45,
    totalInternships: 60,
    totalApplicants: 220,
  };

  return (
    <div className="admin-dashboard-container">
      <h2 className="dashboard-title">Admin Dashboard</h2>

      <Row className="mb-4">
        <Col md={3} sm={6}>
          <Card className="stat-card">
            <Card.Body>
              <h5>Interns</h5>
              <h3>{stats.totalInterns}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="stat-card">
            <Card.Body>
              <h5>Employers</h5>
              <h3>{stats.totalEmployers}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="stat-card">
            <Card.Body>
              <h5>Internships</h5>
              <h3>{stats.totalInternships}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="stat-card">
            <Card.Body>
              <h5>Applicants</h5>
              <h3>{stats.totalApplicants}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="quick-actions">
        <Col md={4} className="mb-3">
          <Button
            variant="primary"
            className="action-button"
            onClick={() => navigate("/admin/users")}
          >
            Manage Users
          </Button>
        </Col>
        <Col md={4} className="mb-3">
          <Button
            variant="info"
            className="action-button"
            onClick={() => navigate("/admin/internships")}
          >
            Manage Internships
          </Button>
        </Col>
        <Col md={4} className="mb-3">
          <Button
            variant="success"
            className="action-button"
            onClick={() => navigate("/admin/applications")}
          >
            View Applications
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
