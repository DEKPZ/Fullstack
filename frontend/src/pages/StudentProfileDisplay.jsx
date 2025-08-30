import React, { useState, useEffect } from "react";
import { fetchMyStudentProfile } from "../api";
import { Card, Spinner, Alert, Row, Col, Badge } from "react-bootstrap";
import { Mail, Phone, Github, Linkedin } from 'lucide-react';
import "./ApplicantProfile.css";

const StudentProfileDisplay = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const profileData = await fetchMyStudentProfile();
        setProfile(profileData);
      } catch (err) {
        setError("Failed to load your profile. Please make sure you are logged in.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return <div className="text-center p-5"><Spinner animation="border" /></div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!profile) {
    return <Alert variant="info">No profile data found. Please complete your profile.</Alert>;
  }

  // Safely parse JSON fields
  const education = JSON.parse(profile.education || '[]');
  const experience = JSON.parse(profile.experience || '[]');
  const projects = JSON.parse(profile.projects || '[]');

  return (
    <div className="applicant-profile-container">
      <div className="applicant-profile-card">
        <header className="profile-header">
          {/* CHANGED: Removed .user from these lines */}
          <h1 className="applicant-name">{profile.first_name} {profile.last_name}</h1>
          <div className="contact-info">
            <span><Mail size={18} /> {profile.email}</span>
            {profile.phone_number && <span><Phone size={18} /> {profile.phone_number}</span>}
          </div>
          <div className="profile-links">
            {profile.github_link && <a href={profile.github_link} target="_blank" rel="noopener noreferrer"><Github size={18} /> GitHub</a>}
            {profile.linkedin_profile && <a href={profile.linkedin_profile} target="_blank" rel="noopener noreferrer"><Linkedin size={18} /> LinkedIn</a>}
          </div>
        </header>

        <section className="profile-section">
          <h2 className="section-title">Bio</h2>
          {/* Bio is part of the user model but available at the top level in the response */}
          <p className="bio-text">{profile.bio || "No bio provided."}</p>
        </section>

        <section className="profile-section">
          <h2 className="section-title">Skills</h2>
          <div className="skills-container">
            {profile.skills && profile.skills.split(',').map((skill, index) => (
              <Badge key={index} className="skill-badge">{skill.trim()}</Badge>
            ))}
          </div>
        </section>

        {/* The rest of the component remains the same */}
        <section className="profile-section">
          <h2 className="section-title">Education</h2>
          <div className="timeline">
            {education.map((edu, index) => (
              <div key={index} className="timeline-item">
                <h5 className="item-title">{edu.degree}</h5>
                <span className="item-institution">{edu.institution}</span>
                <span className="item-duration">{edu.duration}</span>
                <p className="item-description">CGPA: {edu.cgpa}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="profile-section">
          <h2 className="section-title">Experience</h2>
          <div className="timeline">
            {experience.map((exp, index) => (
              <div key={index} className="timeline-item">
                <h5 className="item-title">{exp.role}</h5>
                <span className="item-institution">{exp.company}</span>
                <span className="item-duration">{exp.duration}</span>
                <p className="item-description">{exp.responsibilities}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="profile-section">
          <h2 className="section-title">Projects</h2>
          <Row>
            {projects.map((proj, index) => (
              <Col md={6} key={index} className="mb-4">
                <Card className="project-card">
                  <Card.Body>
                    <Card.Title>{proj.name}</Card.Title>
                    <Card.Text>{proj.description}</Card.Text>
                    <Card.Text><strong>Tools:</strong> {proj.tools}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      </div>
    </div>
  );
};

export default StudentProfileDisplay;