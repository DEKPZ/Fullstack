import React, { useState, useRef } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import "./BuildResume.css";

const BuildResume = () => {
  const resumeRef = useRef();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    links: "",
    objective: "",
    education: {
      degree: "",
      institution: "",
      duration: "",
      cgpa: "",
      location: "",
    },
    techSkills: {
      programming: "",
      frameworks: "",
      tools: "",
      security: "",
    },
    softSkills: "",
    projects: [{ name: "", duration: "", tools: "", description: "" }],
    experience: [{ role: "", company: "", duration: "", responsibilities: "" }],
    certifications: [{ name: "", issuer: "", date: "" }],
    languages: "",
  });

  const handleChange = (e, section, index = null, field = null) => {
    const { name, value } = e.target;

    if (section === "education" || section === "techSkills") {
      setForm({ ...form, [section]: { ...form[section], [name]: value } });
    } else if (["projects", "experience", "certifications"].includes(section)) {
      const updated = [...form[section]];
      updated[index][field] = value;
      setForm({ ...form, [section]: updated });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const addSection = (section) => {
    const emptyEntry = {
      projects: { name: "", duration: "", tools: "", description: "" },
      experience: { role: "", company: "", duration: "", responsibilities: "" },
      certifications: { name: "", issuer: "", date: "" },
    }[section];

    setForm({ ...form, [section]: [...form[section], emptyEntry] });
  };

  const generatePDF = useReactToPrint({
    content: () => resumeRef.current,
    documentTitle: "My_Resume",
  });

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Build Your Resume</h2>

      <Form>
        {/* 1. Contact Info */}
        <Card className="p-4 mb-4">
          <h5>1. Contact Information</h5>
          <Row>
            <Col><Form.Control name="fullName" placeholder="Full Name" onChange={handleChange} /></Col>
            <Col><Form.Control name="phone" placeholder="Phone Number" onChange={handleChange} /></Col>
          </Row>
          <Row className="mt-2">
            <Col><Form.Control name="email" placeholder="Email ID" onChange={handleChange} /></Col>
            <Col><Form.Control name="links" placeholder="LinkedIn / GitHub / Portfolio URL" onChange={handleChange} /></Col>
          </Row>
        </Card>

        {/* 2. Objective */}
        <Card className="p-4 mb-4">
          <h5>2. Objective / Summary</h5>
          <Form.Control as="textarea" name="objective" rows={2} placeholder="Your objective (optional)" onChange={handleChange} />
        </Card>

        {/* 3. Education */}
        <Card className="p-4 mb-4">
          <h5>3. Education</h5>
          <Row>
            <Col><Form.Control name="degree" placeholder="Degree Name" onChange={(e) => handleChange(e, "education")} /></Col>
            <Col><Form.Control name="institution" placeholder="Institution" onChange={(e) => handleChange(e, "education")} /></Col>
          </Row>
          <Row className="mt-2">
            <Col><Form.Control name="duration" placeholder="Duration" onChange={(e) => handleChange(e, "education")} /></Col>
            <Col><Form.Control name="cgpa" placeholder="CGPA or Percentage" onChange={(e) => handleChange(e, "education")} /></Col>
            <Col><Form.Control name="location" placeholder="Location" onChange={(e) => handleChange(e, "education")} /></Col>
          </Row>
        </Card>

        {/* 4. Technical Skills */}
        <Card className="p-4 mb-4">
          <h5>4. Technical Skills</h5>
          <Form.Control className="mb-2" name="programming" placeholder="Programming Languages" onChange={(e) => handleChange(e, "techSkills")} />
          <Form.Control className="mb-2" name="frameworks" placeholder="Frameworks & Libraries" onChange={(e) => handleChange(e, "techSkills")} />
          <Form.Control className="mb-2" name="tools" placeholder="Tools & Platforms" onChange={(e) => handleChange(e, "techSkills")} />
          <Form.Control name="security" placeholder="Security/Domain Skills" onChange={(e) => handleChange(e, "techSkills")} />
        </Card>

        {/* 5. Soft Skills */}
        <Card className="p-4 mb-4">
          <h5>5. Soft Skills</h5>
          <Form.Control name="softSkills" placeholder="E.g. Communication, Problem Solving" onChange={handleChange} />
        </Card>

        {/* 6. Projects */}
        <Card className="p-4 mb-4">
          <h5>6. Projects</h5>
          {form.projects.map((proj, idx) => (
            <div key={idx} className="mb-3">
              <Form.Control className="mb-2" placeholder="Project Name" onChange={(e) => handleChange(e, "projects", idx, "name")} />
              <Form.Control className="mb-2" placeholder="Duration / Hackathon" onChange={(e) => handleChange(e, "projects", idx, "duration")} />
              <Form.Control className="mb-2" placeholder="Technologies Used" onChange={(e) => handleChange(e, "projects", idx, "tools")} />
              <Form.Control placeholder="Project Description" onChange={(e) => handleChange(e, "projects", idx, "description")} />
            </div>
          ))}
          <Button variant="outline-primary" onClick={() => addSection("projects")}>+ Add More Project</Button>
        </Card>

        {/* 7. Experience */}
        <Card className="p-4 mb-4">
          <h5>7. Internships / Work Experience</h5>
          {form.experience.map((exp, idx) => (
            <div key={idx} className="mb-3">
              <Form.Control className="mb-2" placeholder="Role" onChange={(e) => handleChange(e, "experience", idx, "role")} />
              <Form.Control className="mb-2" placeholder="Company" onChange={(e) => handleChange(e, "experience", idx, "company")} />
              <Form.Control className="mb-2" placeholder="Duration" onChange={(e) => handleChange(e, "experience", idx, "duration")} />
              <Form.Control placeholder="Key Responsibilities" onChange={(e) => handleChange(e, "experience", idx, "responsibilities")} />
            </div>
          ))}
        </Card>

        {/* 9. Certifications */}
        <Card className="p-4 mb-4">
          <h5>9. Certifications</h5>
          {form.certifications.map((cert, idx) => (
            <div key={idx} className="mb-3">
              <Form.Control className="mb-2" placeholder="Course Name" onChange={(e) => handleChange(e, "certifications", idx, "name")} />
              <Form.Control className="mb-2" placeholder="Issuing Body" onChange={(e) => handleChange(e, "certifications", idx, "issuer")} />
              <Form.Control placeholder="Date" onChange={(e) => handleChange(e, "certifications", idx, "date")} />
            </div>
          ))}
          <Button variant="outline-primary" onClick={() => addSection("certifications")}>+ Add More Certification</Button>
        </Card>

        {/* 10. Languages */}
        <Card className="p-4 mb-4">
          <h5>10. Languages</h5>
          <Form.Control name="languages" placeholder="E.g. English – Fluent, Tamil – Native" onChange={handleChange} />
        </Card>
      </Form>

      <div className="text-center mt-4">
        <Button variant="success" onClick={generatePDF}>Download PDF Resume</Button>
      </div>

      {/* Hidden printable section */}
      <div style={{ display: "none" }}>
        <div ref={resumeRef}>
          <style>{`
            * { font-family: Arial, sans-serif; line-height: 1.5; }
            h2 { font-size: 24px; margin-bottom: 5px; }
            h4 { border-bottom: 1px solid #333; margin-top: 20px; font-size: 18px; }
            p { margin: 4px 0; }
            ul { padding-left: 20px; }
            .section { margin-bottom: 20px; }
            .title { font-weight: bold; }
            .subtitle { font-style: italic; }
          `}</style>

          <div>
            <h2>{form.fullName}</h2>
            <p>{form.phone} | {form.email} | {form.links}</p>

            {form.objective && (
              <div className="section">
                <h4>Objective</h4>
                <p>{form.objective}</p>
              </div>
            )}

            <div className="section">
              <h4>Education</h4>
              <p className="title">{form.education.degree} — {form.education.institution}</p>
              <p>{form.education.duration} | {form.education.location}</p>
              <p>CGPA/Percentage: {form.education.cgpa}</p>
            </div>

            <div className="section">
              <h4>Technical Skills</h4>
              <ul>
                <li><strong>Programming:</strong> {form.techSkills.programming}</li>
                <li><strong>Frameworks & Libraries:</strong> {form.techSkills.frameworks}</li>
                <li><strong>Tools & Platforms:</strong> {form.techSkills.tools}</li>
                <li><strong>Security/Domain:</strong> {form.techSkills.security}</li>
              </ul>
            </div>

            <div className="section">
              <h4>Soft Skills</h4>
              <p>{form.softSkills}</p>
            </div>

            <div className="section">
              <h4>Projects</h4>
              {form.projects.map((proj, i) => (
                <div key={i}>
                  <p className="title">{proj.name}</p>
                  <p className="subtitle">{proj.duration}</p>
                  <p><strong>Technologies:</strong> {proj.tools}</p>
                  <p>{proj.description}</p>
                </div>
              ))}
            </div>

            <div className="section">
              <h4>Internships / Work Experience</h4>
              {form.experience.map((exp, i) => (
                <div key={i}>
                  <p className="title">{exp.role} at {exp.company}</p>
                  <p className="subtitle">{exp.duration}</p>
                  <p>{exp.responsibilities}</p>
                </div>
              ))}
            </div>

            <div className="section">
              <h4>Certifications</h4>
              <ul>
                {form.certifications.map((cert, i) => (
                  <li key={i}>{cert.name} – {cert.issuer} ({cert.date})</li>
                ))}
              </ul>
            </div>

            <div className="section">
              <h4>Languages</h4>
              <p>{form.languages}</p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default BuildResume;
