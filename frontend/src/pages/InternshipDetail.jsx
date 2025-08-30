import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Badge, Button, Spinner, Alert } from "react-bootstrap";
import { fetchInternshipDetail } from "../api";
import "./InternshipDetail.css";

const InternshipDetail = () => {
  const { internshipId } = useParams();
  const navigate = useNavigate();

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInternship = async () => {
      if (!internshipId) {
        setError("No internship ID provided.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await fetchInternshipDetail(internshipId);
        setInternship(data);
      } catch (err) {
        console.error(`Error fetching internship ${internshipId}:`, err);
        setError("Failed to load internship details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadInternship();
  }, [internshipId]);

  if (loading) {
    return <div className="text-center p-5"><Spinner animation="border" /></div>;
  }

  if (error) {
    return <Alert variant="danger" className="m-3">{error}</Alert>;
  }

  if (!internship) {
    return <Alert variant="warning" className="m-3">Internship data could not be loaded.</Alert>;
  }

  const getListFromString = (str) => {
    if (!str) return [];
    return str.split(',').map(item => item.trim());
  };

  const skills = getListFromString(internship.skills_required);
  const responsibilities = getListFromString(internship.responsibilities);
  const qualifications = getListFromString(internship.qualifications);

  return (
    <div className="internship-detail-container">
      <Card className="internship-detail-card">
        <h2 className="internship-title">{internship.title}</h2>
        <h4 className="company-name">Employer ID: {internship.employer_id}</h4>
        <div className="badges">
          <Badge bg="info">{internship.location}</Badge>
          <Badge bg="success">{internship.duration}</Badge>
          <Badge bg="warning text-dark">Stipend: {internship.stipend || 'N/A'}</Badge>
        </div>

        <p className="posted-date">
          Posted on: {new Date(internship.posted_date).toLocaleDateString()}
        </p>

        <section>
          <h5>Description</h5>
          <p>{internship.description}</p>
        </section>

        {skills.length > 0 && (
          <section>
            <h5>Skills Required</h5>
            <ul className="skills-list">
              {skills.map((skill, idx) => <li key={idx}>{skill}</li>)}
            </ul>
          </section>
        )}
        
        {responsibilities.length > 0 && (
          <section>
            <h5>Responsibilities</h5>
            <ul className="skills-list">
              {responsibilities.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
          </section>
        )}

        {qualifications.length > 0 && (
          <section>
            <h5>Qualifications</h5>
            <ul className="skills-list">
              {qualifications.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
          </section>
        )}

        <Button className="apply-button" onClick={() => navigate(`/apply/${internship.id}`)}>Apply Now</Button>
      </Card>
    </div>
  );
};

export default InternshipDetail;