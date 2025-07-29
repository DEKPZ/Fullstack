import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaGlobe,
  FaIndustry,
  FaUserTie,
  FaBriefcase,
  FaUsers,
  FaClipboardList,
} from "react-icons/fa";
import { fetchCurrentUser, fetchMyEmployerProfile } from "../api";
import "./EmployerDashboard.css";

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [employerData, setEmployerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployerData = async () => {
      try {
        const userDetails = await fetchCurrentUser();
        const employerProfile = await fetchMyEmployerProfile();

        setEmployerData({
          companyName: employerProfile.company_name || "N/A",
          contactPerson: `${userDetails.first_name || ""} ${userDetails.last_name || ""}`.trim(),
          email: userDetails.email || "N/A",
          contactNumber: userDetails.phone_number || "N/A",
          website: employerProfile.website || "N/A",
          industry: employerProfile.industry || "N/A",
          address: userDetails.address || "N/A",
        });

      } catch (err) {
        console.error("Error fetching employer data:", err);
        setError("An error occurred while fetching employer data. Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployerData();
  }, []);

  if (loading) {
    return <div className="loading text-center p-5">Loading Dashboard...</div>;
  }

  if (error) {
    return <div className="error text-center p-5">{error}</div>;
  }
  
  if (!employerData) {
      return <div className="loading text-center p-5">No employer data found.</div>;
  }

  return (
    <div className="employer-dashboard">
      {/* Sidebar Navigation */}
      <div className="sidebar">
        <ListGroup variant="flush">
          <Button className="sidebar-btn" onClick={() => navigate("/profile")}>
            <FaBuilding /> Company Profile
          </Button>
          <Button className="sidebar-btn" onClick={() => navigate("/post-internship")}>
            <FaBriefcase /> Post Internship
          </Button>
          <Button className="sidebar-btn" onClick={() => navigate("/hired-interns")}>
            <FaUsers /> Hired Interns
          </Button>
          {/* --- MODIFICATION START HERE --- */}
          {/* 1. Updated this button to navigate to the new page */}
          <Button className="sidebar-btn" onClick={() => navigate("/employer/my-internships")}>
            <FaClipboardList /> Internship Applications
          </Button>
          {/* --- MODIFICATION END HERE --- */}
          <Button className="sidebar-btn">
            <FaPhone /> Support
          </Button>
        </ListGroup>
      </div>

      {/* Center Dashboard Content */}
      <Container fluid className="dashboard-content d-flex justify-content-center align-items-center">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="employer-card">
              <Card.Body>
                <div className="text-center mb-3">
                  <FaBuilding size={50} className="company-logo" />
                  <h4 className="mt-2">{employerData.companyName}</h4>
                  <p className="text-muted">{employerData.industry}</p>
                </div>

                <Row>
                  <Col md={6}>
                    <p>
                      <FaUserTie className="icon" /> <strong>Contact Person:</strong>{" "}
                      {employerData.contactPerson}
                    </p>
                    <p>
                      <FaEnvelope className="icon" /> <strong>Email:</strong> {employerData.email}
                    </p>
                    <p>
                      <FaPhone className="icon" /> <strong>Contact:</strong>{" "}
                      {employerData.contactNumber}
                    </p>
                    <p>
                      <FaGlobe className="icon" /> <strong>Website:</strong>{" "}
                      <a href={employerData.website} target="_blank" rel="noopener noreferrer">
                        {employerData.website}
                      </a>
                    </p>
                  </Col>
                  <Col md={6}>
                    <p>
                      <FaIndustry className="icon" /> <strong>Industry:</strong>{" "}
                      {employerData.industry}
                    </p>
                    <p>
                      <FaMapMarkerAlt className="icon" /> <strong>Address:</strong>{" "}
                      {employerData.address}
                    </p>
                  </Col>
                </Row>

                <div className="button-group mt-4 text-center">
                  <Button className="teal-button me-2" onClick={() => navigate("/post-internship")}>
                    Post Internship
                  </Button>
                  <Button className="teal-button" onClick={() => navigate("/hired-interns")}>
                    Hired Interns
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EmployerDashboard;
