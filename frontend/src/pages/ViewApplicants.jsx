import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Table, Button, Badge, Card, Alert, Spinner, ProgressBar } from "react-bootstrap";
import {
  fetchRecommendedApplicants,
  fetchApplicantProfile,
  updateApplicationStatus
} from "../api";
import "./ViewApplicants.css";

const ViewApplicants = () => {
  const { internshipId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadApplicants = async () => {
      if (!internshipId) return;
      try {
        setLoading(true);
        const applications = await fetchRecommendedApplicants(internshipId);

        const applicantsWithDetails = await Promise.all(
          applications.map(async (app) => {
            const profile = await fetchApplicantProfile(app.student_id);
            return {
              ...app,
              name: `${profile.first_name || 'Applicant'} ${profile.last_name || ''}`.trim(),
              email: "Hidden", // Email remains hidden until hired
              university: profile.education ? (JSON.parse(profile.education)[0]?.institution || "N/A") : "N/A",
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
      // Optimistically update the UI
      const updatedApplicants = applicants.map((app) =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      );
      setApplicants(updatedApplicants);
      // Make the API call
      await updateApplicationStatus(applicationId, newStatus);
    } catch (err) {
      console.error(`Error updating status for application ${applicationId}:`, err);
      setError("Failed to update status. Please try again.");
      // Revert UI on error if needed
      // loadApplicants(); 
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { bg: "secondary", text: "Pending" },
      reviewed: { bg: "info", text: "Reviewed" },
      accepted: { bg: "warning", text: "Offer Sent" },
      rejected: { bg: "danger", text: "Rejected" },
      withdrawn: { bg: "dark", text: "Withdrawn by Student" },
      hired: { bg: "success", text: "Hired" },
    };
    const { bg, text } = statusMap[status.toLowerCase()] || { bg: "light", text: status };
    return <Badge bg={bg}>{text}</Badge>;
  };

  if (loading) {
    return <div className="text-center p-5"><Spinner animation="border" /></div>;
  }

  return (
    <div className="view-applicants-container">
      <Card className="view-applicants-card">
        <h2 className="page-title">Ranked Applicants for Internship #{internshipId}</h2>
        {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

        <Table striped bordered hover responsive className="applicants-table">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Match Score</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applicants.length > 0 ? (
              applicants.map((applicant) => (
                <tr key={applicant.id}>
                  <td>
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
                  <td>
                    {getStatusBadge(applicant.status)}
                  </td>
                  <td>
                    {/* Conditional Action Buttons */}
                    {(applicant.status === "pending" || applicant.status === "reviewed") && (
                      <>
                        <Button size="sm" variant="success" className="me-2" onClick={() => handleStatusUpdate(applicant.id, "accepted")}>
                          Send Offer
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleStatusUpdate(applicant.id, "rejected")}>
                          Reject
                        </Button>
                      </>
                    )}
                    {applicant.status === "accepted" && (
                      <span className="text-muted fst-italic">Waiting for Student...</span>
                    )}
                    {applicant.status === "hired" && (
                      <Button size="sm" variant="primary" onClick={() => navigate(`/applicant/${applicant.student_id}`)}>
                        View Contact
                      </Button>
                    )}
                     {(applicant.status === "rejected" || applicant.status === "withdrawn") && (
                        <span className="text-muted">No action required.</span>
                     )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No applicants yet.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};

export default ViewApplicants;
