// src/pages/ApplicantProfile.jsx
import React, { useState, useEffect } from "react";
import { Card, Row, Col, Badge, Button, Spinner, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { fetchApplicantProfile } from "../api";
import { Briefcase, GraduationCap, Code, Star, Mail, Phone, Linkedin, Github, Link as LinkIcon, FileText } from 'lucide-react';
import "./ApplicantProfile.css";

// Helper to safely parse JSON data from the backend, providing a default value if it fails
const safeJsonParse = (jsonString, defaultValue = []) => {
    if (!jsonString || typeof jsonString !== 'string') return defaultValue;
    try {
        const parsed = JSON.parse(jsonString);
        // Ensure the parsed data is an array if the default is an array
        return Array.isArray(parsed) ? parsed : defaultValue;
    } catch (e) {
        console.error("Failed to parse JSON string:", jsonString, e);
        return defaultValue;
    }
};


const ApplicantProfile = () => {
    const { applicantId } = useParams();
    const navigate = useNavigate();

    const [applicant, setApplicant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadApplicantData = async () => {
            if (!applicantId) {
                setError("No applicant ID provided.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const profileData = await fetchApplicantProfile(applicantId);

                // Rebuild the applicant object, parsing JSON strings into arrays
                setApplicant({
                    name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
                    email: profileData.email,
                    mobile: profileData.phone_number || "N/A",
                    bio: profileData.bio || profileData.career_goals || "No career objective provided.",
                    
                    // Safely parse all relevant fields
                    education: safeJsonParse(profileData.education),
                    experience: safeJsonParse(profileData.experience),
                    projects: safeJsonParse(profileData.projects),
                    certifications: safeJsonParse(profileData.certifications),
                    skills: profileData.skills ? profileData.skills.split(',').map(s => s.trim()) : [],
                    
                    // Links
                    resume_url: profileData.resume_url,
                    portfolio_url: profileData.portfolio_url,
                    github_link: profileData.github_link,
                    linkedin_profile: profileData.linkedin_profile,
                });

            } catch (err) {
                console.error("Error fetching applicant data:", err);
                setError("Failed to load applicant profile. Please ensure you are logged in and have the correct permissions.");
            } finally {
                setLoading(false);
            }
        };

        loadApplicantData();
    }, [applicantId]);

    if (loading) {
        return <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>;
    }

    if (error) {
        return <Alert variant="danger" className="m-3">{error}</Alert>;
    }

    if (!applicant) {
        return <Alert variant="warning" className="m-3">Applicant data could not be loaded.</Alert>;
    }

    return (
        <div className="applicant-profile-container">
            <Card className="applicant-profile-card">
                {/* --- HEADER --- */}
                <header className="profile-header">
                    <h1 className="applicant-name">{applicant.name}</h1>
                    <div className="contact-info">
                        <span><Mail size={16} /> {applicant.email}</span>
                        <span><Phone size={16} /> {applicant.mobile}</span>
                    </div>
                    <div className="profile-links">
                        {applicant.linkedin_profile && <a href={applicant.linkedin_profile} target="_blank" rel="noopener noreferrer"><Linkedin size={18} /> LinkedIn</a>}
                        {applicant.github_link && <a href={applicant.github_link} target="_blank" rel="noopener noreferrer"><Github size={18} /> GitHub</a>}
                        {applicant.portfolio_url && <a href={applicant.portfolio_url} target="_blank" rel="noopener noreferrer"><LinkIcon size={18} /> Portfolio</a>}
                        {applicant.resume_url && <a href={applicant.resume_url} target="_blank" rel="noopener noreferrer"><FileText size={18} /> View Resume</a>}
                    </div>
                </header>

                {/* --- OBJECTIVE / BIO --- */}
                <section className="profile-section">
                    <h3 className="section-title">Career Objective</h3>
                    <p className="bio-text">{applicant.bio}</p>
                </section>

                {/* --- SKILLS --- */}
                <section className="profile-section">
                    <h3 className="section-title">Skills</h3>
                    <div className="skills-container">
                        {applicant.skills.length > 0 ? (
                            applicant.skills.map((skill, index) => (
                                <Badge key={index} pill bg="primary" className="skill-badge">{skill}</Badge>
                            ))
                        ) : <p className="text-muted">No skills listed.</p>}
                    </div>
                </section>

                {/* --- EXPERIENCE --- */}
                <section className="profile-section">
                    <h3 className="section-title"><Briefcase size={20} /> Experience</h3>
                    <div className="timeline">
                        {applicant.experience.length > 0 ? (
                            applicant.experience.map((exp, index) => (
                                <div key={index} className="timeline-item">
                                    <div className="timeline-content">
                                        <h5 className="item-title">{exp.role} @ {exp.company}</h5>
                                        <span className="item-duration">{exp.duration}</span>
                                        <p className="item-description">{exp.responsibilities}</p>
                                    </div>
                                </div>
                            ))
                        ) : <p className="text-muted">No work experience provided.</p>}
                    </div>
                </section>

                {/* --- EDUCATION --- */}
                <section className="profile-section">
                    <h3 className="section-title"><GraduationCap size={20} /> Education</h3>
                     <div className="timeline">
                        {applicant.education.length > 0 ? (
                           applicant.education.map((edu, index) => (
                                <div key={index} className="timeline-item">
                                     <div className="timeline-content">
                                        <h5 className="item-title">{edu.degree}</h5>
                                        <span className="item-institution">{edu.institution || edu.college}</span>
                                        <p className="item-description">
                                            {edu.duration && `Duration: ${edu.duration} | `}
                                            {edu.cgpa && `CGPA: ${edu.cgpa}`}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : <p className="text-muted">No education details provided.</p>}
                    </div>
                </section>

                 {/* --- PROJECTS --- */}
                <section className="profile-section">
                    <h3 className="section-title"><Code size={20} /> Projects</h3>
                     <Row>
                        {applicant.projects.length > 0 ? (
                           applicant.projects.map((proj, index) => (
                                <Col md={6} key={index} className="mb-3">
                                    <Card className="project-card">
                                        <Card.Body>
                                            <Card.Title>{proj.name || proj.title}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">{proj.tools || (proj.techStack || []).join(', ')}</Card.Subtitle>
                                            <Card.Text>{proj.description}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        ) : <p className="text-muted ms-3">No projects listed.</p>}
                    </Row>
                </section>

                <div className="action-buttons mt-4">
                    <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                        Back to Applicants
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default ApplicantProfile;