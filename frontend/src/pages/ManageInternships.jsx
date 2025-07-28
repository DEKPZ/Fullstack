import React, { useState, useEffect } from "react";
import { Table, Badge, Button, Card, Alert } from "react-bootstrap";
import { fetchAllInternshipsAdmin, deleteInternshipAdmin } from "../api"; // 1. Import API functions
import "./ManageInternships.css";

const ManageInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to load internships from the backend
  const loadInternships = async () => {
    try {
      setLoading(true);
      const data = await fetchAllInternshipsAdmin();
      setInternships(data);
    } catch (err) {
      console.error("Error fetching internships:", err);
      setError("Failed to fetch internships. You must be logged in as an admin.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch internships when the component mounts
  useEffect(() => {
    loadInternships();
  }, []);

  // 3. Implement the delete functionality
  const handleDelete = async (internshipId) => {
    if (window.confirm("Are you sure you want to permanently delete this internship?")) {
      try {
        await deleteInternshipAdmin(internshipId);
        // Refresh the list after successful deletion
        setInternships(internships.filter((i) => i.id !== internshipId));
      } catch (err) {
        console.error(`Error deleting internship ${internshipId}:`, err);
        setError("Failed to delete internship.");
      }
    }
  };

  return (
    <div className="manage-internships-container">
      <Card className="manage-internships-card">
        <h2 className="internship-title">Manage All Internships (Admin)</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center">Loading internships...</div>
        ) : (
          <Table striped bordered hover responsive className="internship-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Employer ID</th>
                <th>Location</th>
                <th>Posted On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {internships.length > 0 ? (
                internships.map((internship, index) => (
                  <tr key={internship.id}>
                    <td>{index + 1}</td>
                    <td>{internship.title}</td>
                    {/* 4. Displaying data available from the backend */}
                    <td>{internship.employer_id}</td>
                    <td>{internship.location}</td>
                    <td>{new Date(internship.posted_date).toLocaleDateString()}</td>
                    <td>
                      <Badge bg={internship.is_active ? "success" : "secondary"}>
                        {internship.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDelete(internship.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No internships found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default ManageInternships;