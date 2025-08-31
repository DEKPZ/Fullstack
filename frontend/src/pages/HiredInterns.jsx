import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Spinner, Alert } from "react-bootstrap";
import { FaUserGraduate, FaCalendarCheck, FaEnvelope, FaPhone } from "react-icons/fa";
// MODIFICATION: Import the single, efficient API function
import { fetchHiredInternsDetails } from "../api";
import "./HiredInterns.css";

// Helper function to safely parse education data
const getUniversity = (educationString) => {
    if (!educationString) return "N/A";
    try {
        const education = JSON.parse(educationString);
        return education[0]?.institution || "N/A";
    } catch (e) {
        return "N/A";
    }
};

const HiredInterns = () => {
  const [hiredInterns, setHiredInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHiredInterns = async () => {
      try {
        setLoading(true);
        // MODIFICATION: Use the single API call to get all required data
        const hiredApplications = await fetchHiredInternsDetails();
        setHiredInterns(hiredApplications);
      } catch (err) {
        console.error("Error fetching hired interns:", err);
        setError("Failed to load hired interns. Please ensure you are logged in as an employer.");
      } finally {
        setLoading(false);
      }
    };

    loadHiredInterns();
  }, []);

  if (loading) {
    return <div className="text-center p-5"><Spinner animation="border" /></div>;
  }

  if (error) {
    return <Alert variant="danger" className="m-3">{error}</Alert>;
  }

  return (
    <Container className="dashboard-container mt-4">
      <h2 className="text-center mb-4 dashboard-title">Hired Interns</h2>

      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow-lg hired-interns-card">
            <Card.Body>
              <Table responsive bordered hover>
                <thead className="table-header">
                  <tr>
                    <th><FaUserGraduate /> Intern Name</th>
                    <th>Position</th>
                    <th><FaCalendarCheck /> Hired Date</th>
                    <th><FaEnvelope /> Email</th>
                    <th><FaPhone /> Contact</th>
                    <th>University</th>
                  </tr>
                </thead>
                <tbody>
                  {hiredInterns.length > 0 ? (
                    hiredInterns.map((app) => (
                      <tr key={app.id}>
                        {/* MODIFICATION: Access nested data safely */}
                        <td>{`${app.student?.first_name || ''} ${app.student?.last_name || ''}`}</td>
                        <td>{app.internship?.title || 'N/A'}</td>
                        <td>{new Date(app.applied_date).toLocaleDateString()}</td>
                        <td>{app.student?.email || 'N/A'}</td>
                        <td>{app.student?.phone_number || 'N/A'}</td>
                        <td>{getUniversity(app.student?.student_profile?.education)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">You have not hired any interns yet.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HiredInterns;