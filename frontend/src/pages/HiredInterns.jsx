import React from "react";
import { Container, Row, Col, Card, Table } from "react-bootstrap";
import { FaUserGraduate, FaCalendarCheck } from "react-icons/fa";
import "./HiredInterns.css";

const HiredInterns = () => {
  // Dummy data for hired interns
  const hiredInterns = [
    {
      name: "Rahul Sharma",
      position: "Software Developer Intern",
      hiredDate: "March 15, 2025",
      email: "rahul.sharma@example.com",
      contact: "+91 98765 43210",
      university: "IIT Bombay",
    },
    {
      name: "Priya Patel",
      position: "UI/UX Designer Intern",
      hiredDate: "April 02, 2025",
      email: "priya.patel@example.com",
      contact: "+91 92345 67890",
      university: "NIT Trichy",
    },
    {
      name: "Amit Verma",
      position: "Data Analyst Intern",
      hiredDate: "April 10, 2025",
      email: "amit.verma@example.com",
      contact: "+91 93456 78901",
      university: "BITS Pilani",
    },
  ];

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
                  {hiredInterns.map((intern, index) => (
                    <tr key={index}>
                      <td>{intern.name}</td>
                      <td>{intern.position}</td>
                      <td>{intern.hiredDate}</td>
                      <td>{intern.email}</td>
                      <td>{intern.contact}</td>
                      <td>{intern.university}</td>
                    </tr>
                  ))}
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
