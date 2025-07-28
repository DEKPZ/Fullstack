import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // 1. Import Link
import { Table, Button, Badge, Card, Alert, Spinner } from "react-bootstrap";
import {
  fetchApplicantsForInternship,
  fetchApplicantProfile,
  updateApplicationStatus,
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
        const applications = await fetchApplicantsForInternship(internshipId);

        const applicantsWithDetails = await Promise.all(
          applications.map(async (app) => {
            const profile = await fetchApplicantProfile(app.student_id);
            
            // NOTE: The backend doesn't have an endpoint for employers to get a student's
            // full user details (like name/email). We fetch that on the profile page itself.
            // Here, we'll use a placeholder and make it a link.
            return {
              ...app,
              name: `Student ID: ${app.student_id}`, // Using ID as a placeholder name
              university: profile.education || "N/A",
              resumeLink: profile.resume_url || "#",
            };
          })
        );
        setApplicants(applicantsWithDetails);
      } catch (err) {
        console.error("Error fetching applicants:", err);
        setError("Failed to load applicants. You must be logged in as the employer who posted this internship.");
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
    } catch (err) {
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
        <h2 className="page-title">Applicants for Internship #{internshipId}</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        <Table striped bordered hover responsive className="applicants-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Applicant</th>
              <th>University</th>
              <th>Applied On</th>
              <th>Status</th>
              <th>Resume</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applicants.length > 0 ? (
              applicants.map((applicant, index) => (
                <tr key={applicant.id}>
                  <td>{index + 1}</td>
                  <td>
                    {/* 2. Make the applicant's name a link to their profile */}
                    <Link to={`/applicant/${applicant.student_id}`}>
                      {applicant.name}
                    </Link>
                  </td>
                  <td>{applicant.university}</td>
                  <td>{new Date(applicant.applied_date).toLocaleDateString()}</td>
                  <td>
                    <Badge
                      bg={
                        applicant.status === "accepted" || applicant.status === "hired" ? "success"
                        : applicant.status === "rejected" ? "danger"
                        : "warning"
                      }
                    >
                      {applicant.status}
                    </Badge>
                  </td>
                  <td>
                    <a href={applicant.resumeLink} target="_blank" rel="noopener noreferrer">
                      View
                    </a>
                  </td>
                  <td>
                    {(applicant.status === "pending" || applicant.status === "reviewed") && (
                      <>
                        <Button
                          size="sm"
                          variant="success"
                          className="me-2"
                          onClick={() => handleStatusUpdate(applicant.id, "accepted")}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleStatusUpdate(applicant.id, "rejected")}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">No applicants yet.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};

export default ViewApplicants;
