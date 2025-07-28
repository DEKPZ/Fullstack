import React from "react";
import { useParams } from "react-router-dom";
import { Card, Badge, Button } from "react-bootstrap";
import "./InternshipDetail.css";

const InternshipDetail = () => {
  const { internshipId } = useParams(); // to fetch specific internship if needed

  // This data can later come from an API
  const internship = {
    title: "Frontend Developer Intern",
    company: "Google",
    location: "Remote",
    duration: "3 Months",
    stipend: "₹15,000/month",
    postedOn: "July 12, 2025",
    applyBy: "July 25, 2025",
    description: `We are looking for a passionate Frontend Developer Intern to join our team.`,
    skills: ["React", "JavaScript", "HTML", "CSS"],
    perks: ["Certificate", "Letter of Recommendation", "Flexible Hours"],
    companyInfo: `Google is a global technology leader focusing on AI and cloud services.`,
    website: "https://www.google.com",
  };

  return (
    <div className="internship-detail-container">
      <Card className="internship-detail-card">
        <h2 className="internship-title">{internship.title}</h2>
        <h4 className="company-name">{internship.company}</h4>
        <div className="badges">
          <Badge bg="info">{internship.location}</Badge>
          <Badge bg="success">{internship.duration}</Badge>
          <Badge bg="warning text-dark">Stipend: {internship.stipend}</Badge>
        </div>

        <p className="posted-date">Posted on: {internship.postedOn} | Apply by: {internship.applyBy}</p>

        <section>
          <h5>Description</h5>
          <p>{internship.description}</p>
        </section>

        <section>
          <h5>Skills Required</h5>
          <ul className="skills-list">
            {internship.skills.map((skill, idx) => (
              <li key={idx}>{skill}</li>
            ))}
          </ul>
        </section>

        <section>
          <h5>Perks</h5>
          <ul className="skills-list">
            {internship.perks.map((perk, idx) => (
              <li key={idx}>{perk}</li>
            ))}
          </ul>
        </section>

        <section>
          <h5>About the Company</h5>
          <p>{internship.companyInfo}</p>
          <a href={internship.website} target="_blank" rel="noopener noreferrer">
            Visit Company Website
          </a>
        </section>

        <Button className="apply-button">Apply Now</Button>
      </Card>
    </div>
  );
};

export default InternshipDetail;
