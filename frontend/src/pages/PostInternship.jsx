import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { postInternship } from "../api"; // 1. Import your API function
import "./PostInternship.css";

function PostInternship() {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    stipend: "",
    duration: "",
    requirements: "", // 2. Renamed from 'skills' to match the backend schema
    description: "",
    is_active: true, // Default to active
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // 3. The data structure now matches the 'InternshipCreate' schema
      const internshipData = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        location: formData.location,
        stipend: formData.stipend || "Unpaid", // Set a default if stipend is empty
        duration: formData.duration,
        is_active: formData.is_active,
      };

      await postInternship(internshipData); // 4. Use the centralized API function

      setSuccess("Internship posted successfully!");
      // Reset form
      setFormData({
        title: "",
        location: "",
        stipend: "",
        duration: "",
        requirements: "",
        description: "",
        is_active: true,
      });
    } catch (err) {
      console.error("Error posting internship:", err);
      setError(err.message || "Failed to post internship. Please ensure you are logged in as an employer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-internship-page">
      <Container className="post-internship-container">
        <h2 className="text-center">Post an Internship</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit} className="post-internship-form">
          <Form.Group className="mb-3">
            <Form.Label>Internship Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Company Name is removed as it's linked to the logged-in employer automatically */}

          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
              <Form.Label>Stipend (e.g., "$500/month" or "Unpaid")</Form.Label>
              <Form.Control
                type="text"
                name="stipend"
                value={formData.stipend}
                onChange={handleChange}
                placeholder="Leave blank if unpaid"
              />
            </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Duration (e.g., "3 months")</Form.Label>
            <Form.Control
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Required Skills / Requirements</Form.Label>
            <Form.Control
              type="text"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Internship Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="submit-btn w-100" disabled={loading}>
            {loading ? "Posting..." : "Post Internship"}
          </Button>
        </Form>
      </Container>
    </div>
  );
}

export default PostInternship;