// src/pages/HiredInterns.jsx

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Spinner, Alert } from "react-bootstrap";
import { FaUserGraduate, FaCalendarCheck } from "react-icons/fa";
// 1. Import the necessary API functions
import { fetchHiredInterns, fetchUserById, fetchInternshipDetail } from "../api";
import "./HiredInterns.css";

const HiredInterns = () => {
  // 2. Set up state for loading, data, and errors
  const [hiredInterns, setHiredInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. Use useEffect to fetch data when the component loads
  useEffect(() => {
    const loadHiredInterns = async () => {
      try {
        setLoading(true);
        // First, get the list of applications with 'hired' status
        const hiredApplications = await fetchHiredInterns();

        if (hiredApplications.length === 0) {
          setHiredInterns([]);
          setLoading(false);
          return;
        }

        // 4. For each application, fetch the full student and internship details
        const detailedHiredInterns = await Promise.all(
          hiredApplications.map(async (app) => {
            // Fetch student details (name, email, etc.) and internship details (position title)
            const [studentData, internshipData] = await Promise.all([
              fetchUserById(app.student_id),
              fetchInternshipDetail(app.internship_id)
            ]);

            // 5. Combine all the data into one object for easy display
            return {
              id: app.id,
              name: `${studentData.first_name || ''} ${studentData.last_name || ''}`.trim(),
              position: internshipData.title,
              hiredDate: new Date(app.applied_date).toLocaleDateString(), // Using applied_date as a placeholder
              email: studentData.email,
              contact: studentData.phone_number || "N/A",
              university: "N/A", // The user profile doesn't store this, it could be added to StudentProfile
            };
          })
        );

        setHiredInterns(detailedHiredInterns);
      } catch (err) {
        console.error("Error fetching hired interns:", err);
        setError("Failed to load hired interns. Please ensure you are logged in as an employer.");
      } finally {
        setLoading(false);
      }
    };

    loadHiredInterns();
  }, []); // The empty array ensures this runs only once on component mount

  // 6. Render loading and error states
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
                    <th>Email</th>
                    <th>Contact</th>
                    <th>University</th>
                  </tr>
                </thead>
                <tbody>
                  {/* 7. Dynamically render the hired interns from the state */}
                  {hiredInterns.length > 0 ? (
                    hiredInterns.map((intern) => (
                      <tr key={intern.id}>
                        <td>{intern.name}</td>
                        <td>{intern.position}</td>
                        <td>{intern.hiredDate}</td>
                        <td>{intern.email}</td>
                        <td>{intern.contact}</td>
                        <td>{intern.university}</td>
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