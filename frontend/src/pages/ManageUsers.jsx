import React, { useState, useEffect } from "react";
import { Table, Badge, Button, Form, Card, Alert } from "react-bootstrap";
import { fetchAllUsers, deleteUser } from "../api"; // 1. Import API functions
import "./ManageUsers.css";

const ManageUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to load users from the backend
  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users. You must be logged in as an admin.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch users when the component mounts
  useEffect(() => {
    loadUsers();
  }, []);

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return <Badge bg="danger">Admin</Badge>;
      case "employer":
        return <Badge bg="primary">Employer</Badge>;
      case "student":
        return <Badge bg="success">Intern</Badge>;
      default:
        return <Badge bg="secondary">{role}</Badge>;
    }
  };

  // 3. Implement the delete functionality
  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await deleteUser(userId);
        // Refresh the user list after deletion
        setUsers(users.filter((user) => user.id !== userId));
      } catch (err) {
        console.error(`Error deleting user ${userId}:`, err);
        setError("Failed to delete user.");
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manage-users-container">
      <Card className="manage-users-card">
        <h2 className="manage-title">Manage Users</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form.Control
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input mb-3"
        />

        {loading ? (
          <div className="text-center">Loading users...</div>
        ) : (
          <Table striped bordered hover responsive className="user-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    {/* 4. Display combined first_name and last_name */}
                    <td>{`${user.first_name || ''} ${user.last_name || ''}`.trim()}</td>
                    <td>{user.email}</td>
                    <td>{getRoleBadge(user.role)}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="info"
                        className="me-2"
                        onClick={() => alert(`Viewing profile for user ID: ${user.id}`)} // Placeholder for view profile
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No users found.
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

export default ManageUsers;