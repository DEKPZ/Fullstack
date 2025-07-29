// src/pages/HiredInterns.jsx

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Spinner, Alert } from "react-bootstrap";
import { FaUserGraduate, FaCalendarCheck } from "react-icons/fa";
// 1. REMOVE the import for fetchUserById as it's the source of the error
import { fetchHiredInterns, fetchInternshipDetail, fetchApplicantProfile } from "../api";
import "./HiredInterns.css";

const HiredInterns = () => {
  const [hiredInterns, setHiredInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHiredInterns = async () => {
      try {
        setLoading(true);
        const hiredApplications = await fetchHiredInterns();

        if (hiredApplications.length === 0) {
          setHiredInterns([]);
          setLoading(false); // Stop loading if there's nothing to fetch
          return;
        }

        const detailedHiredInterns = await Promise.all(
          hiredApplications.map(async (app) => {
            // 2. FIX: Remove the failing fetchUserById call from Promise.all
            // We now only fetch the internship and the public applicant profile.
            const [internshipData, profileData] = await Promise.all([
              fetchInternshipDetail(app.internship_id),
              fetchApplicantProfile(app.student_id)
            ]);

            // 3. FIX: Construct the object using only the data from the successful API calls.
            // We assume the applicant profile contains the necessary name, email, etc.
            return {
              id: app.id,
              name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
              position: internshipData.title,
              hiredDate: new Date(app.applied_date).toLocaleDateString(), // Using applied_date as a stand-in
              email: profileData.email || "N/A",
              contact: profileData.phone_number || "N/A",
              university: profileData.education || "N/A",
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
                    <th>Email</th>
                    <th>Contact</th>
                    <th>University</th>
                  </tr>
                </thead>
                <tbody>
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