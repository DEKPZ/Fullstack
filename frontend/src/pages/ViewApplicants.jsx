import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Table, Button, Badge, Card, Alert, Spinner, ProgressBar } from "react-bootstrap";
import {
  fetchRecommendedApplicants, // Changed to get ranked applicants
  fetchApplicantProfile,
  updateApplicationStatus
} from "../api";
import "./ViewApplicants.css";

const ViewApplicants = () => {
  const { internshipId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadApplicants = async () => {
      if (!internshipId) return;
      try {
        setLoading(true);
        // 1. Get the ranked list of applicants, with match scores included
        const applications = await fetchRecommendedApplicants(internshipId);

        // 2. For each application, fetch only the public-facing applicant profile
        const applicantsWithDetails = await Promise.all(
          applications.map(async (app) => {
            // Fetch only the profile, which should contain all needed info
            const profile = await fetchApplicantProfile(app.student_id);
            
            return {
              ...app,
              name: `${profile.first_name || 'Applicant'} ${profile.last_name || ''}`.trim(), // Assuming name is in profile
              email: profile.email || "Email not available", // Assuming email is in profile
              university: profile.education || "N/A",
              resumeLink: profile.resume_url || "#",
            };
          })
        );
        setApplicants(applicantsWithDetails);
      } catch (err) {
        console.error("Error fetching applicants:", err);
        setError("Failed to load ranked applicants. You must be logged in as the employer who posted this internship.");
      } finally {
        setLoading(false);
      }
    };

    loadApplicants();
  }, [internshipId]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      const updatedApplicants = applicants.map((app) =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      );
      setApplicants(updatedApplicants);
      await updateApplicationStatus(applicationId, newStatus);
    } catch (err)      {
        console.error(`Error updating status for application ${applicationId}:`, err);
        setError("Failed to update status. Please try again.");
      }
    };
  
    if (loading) {
      return <div className="text-center p-5"><Spinner animation="border" /></div>;
    }
  
    return (
      <div className="view-applicants-container">
        <Card className="view-applicants-card">
          <h2 className="page-title">Ranked Applicants for Internship #{internshipId}</h2>
          {error && <Alert variant="danger">{error}</Alert>}
  
          <Table striped bordered hover responsive className="applicants-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Match Score</th>
                <th>Email</th>
                <th>University</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applicants.length > 0 ? (
                applicants.map((applicant) => (
                  <tr key={applicant.id}>
                    <td>
                      {/* Link remains the same, assuming /applicant/:id route is correct */}
                      <Link to={`/applicant/${applicant.student_id}`}>
                        {applicant.name}
                      </Link>
                    </td>
                    <td>
                      {applicant.match_score != null ? (
                        <div className="d-flex align-items-center">
                          <span className="me-2 fw-bold">{applicant.match_score}%</span>
                          <ProgressBar 
                            now={applicant.match_score} 
                            variant={applicant.match_score > 75 ? 'success' : applicant.match_score > 50 ? 'info' : 'warning'}
                            style={{ width: '100px' }} 
                          />
                        </div>
                      ) : <span className="text-muted">N/A</span>}
                    </td>
                    <td>{applicant.email}</td>
                    <td>{applicant.university}</td>
                    <td>
                      <Badge
                        bg={
                          applicant.status === "hired" ? "primary"
                          : applicant.status === "accepted" ? "success"
                          : applicant.status === "rejected" ? "danger"
                          : "warning"
                        }
                      >
                        {applicant.status}
                      </Badge>
                    </td>
                    <td>
                      {(applicant.status === "pending" || applicant.status === "reviewed") && (
                        <>
                          <Button size="sm" variant="success" className="me-2" onClick={() => handleStatusUpdate(applicant.id, "accepted")}>
                            Accept
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => handleStatusUpdate(applicant.id, "rejected")}>
                            Reject
                          </Button>
                        </>
                      )}
                       {applicant.status === "accepted" && (
                          <Button size="sm" variant="primary" onClick={() => handleStatusUpdate(applicant.id, "hired")}>
                            Hire
                          </Button>
                       )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No applicants yet.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card>
      </div>
    );
  };
  
  export default ViewApplicants;