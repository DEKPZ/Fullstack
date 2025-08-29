import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card, Alert } from "react-bootstrap";
import "./BuildResume.css";
import { generateResumePdf } from "../api"; // Ensure this is imported from your api.js file

const BuildResume = () => {
  // State for the form data
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

  // State for loading and error messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handles changes for all form inputs
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

  // Adds a new entry for repeatable sections (projects, experience, etc.)
  const addSection = (section) => {
    const emptyEntry = {
      projects: { name: "", duration: "", tools: "", description: "" },
      experience: { role: "", company: "", duration: "", responsibilities: "" },
      certifications: { name: "", issuer: "", date: "" },
    }[section];

    setForm({ ...form, [section]: [...form[section], emptyEntry] });
  };

  // Main function to handle PDF generation
  const handleGeneratePdf = async () => {
    setLoading(true);
    setError("");

    // **ATS FEATURE**: Map frontend form state to the backend's Pydantic schema.
    // This ensures the data is structured correctly for the ATS-friendly template.
    const resumeData = {
      personalInfo: {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        githubLink: form.links, // Assuming 'links' is for GitHub
        linkedinProfile: "", // You can add a separate field for this if needed
      },
      objective: form.objective,
      education: [
        {
          degree: form.education.degree,
          college: form.education.institution,
          cgpa: form.education.cgpa,
          startDate: form.education.duration, // The backend expects startDate and endDate
          endDate: "", // You might want to add a separate field for this
        },
      ],
      projects: form.projects.map((proj, index) => ({
        id: index.toString(),
        title: proj.name,
        description: proj.description,
        techStack: proj.tools ? proj.tools.split(",").map((t) => t.trim()) : [],
        githubLink: "",
      })),
      experience: form.experience.map((exp, index) => ({
        id: index.toString(),
        role: exp.role,
        company: exp.company,
        startDate: exp.duration,
        endDate: "",
        responsibilities: exp.responsibilities ? exp.responsibilities.split("\n") : [],
      })),
      skills: [
        ...form.techSkills.programming.split(","),
        ...form.techSkills.frameworks.split(","),
        ...form.techSkills.tools.split(","),
        ...form.techSkills.security.split(","),
        ...form.softSkills.split(","),
      ]
        .map((s) => s.trim())
        .filter((s) => s), // Clean up empty strings
      certifications: form.certifications.map((cert, index) => ({
        id: index.toString(),
        name: cert.name,
        institution: cert.issuer,
        year: cert.date,
      })),
    };

    try {
      const pdfBlob = await generateResumePdf(resumeData);

      // Create a URL for the blob and trigger the download
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      // Use the user's name for a dynamic filename
      const fileName = form.fullName ? `${form.fullName.replace(" ", "_")}_Resume.pdf` : "resume.pdf";
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Clean up the blob URL
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error generating PDF:", err);
      setError("Failed to generate PDF. Please ensure you are logged in and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Build Your ATS-Friendly Resume</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form>
        {/* 1. Contact Info */}
        <Card className="p-4 mb-4">
          <h5>1. Contact Information</h5>
          <Row>
            <Col>
              <Form.Control name="fullName" placeholder="Full Name" onChange={handleChange} />
            </Col>
            <Col>
              <Form.Control name="phone" placeholder="Phone Number" onChange={handleChange} />
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <Form.Control name="email" placeholder="Email ID" onChange={handleChange} />
            </Col>
            <Col>
              <Form.Control name="links" placeholder="LinkedIn / GitHub URL" onChange={handleChange} />
            </Col>
          </Row>
        </Card>

        {/* 2. Objective */}
        <Card className="p-4 mb-4">
          <h5>2. Objective / Summary</h5>
          <Form.Control as="textarea" name="objective" rows={2} placeholder="A brief summary of your career goals (optional)" onChange={handleChange} />
        </Card>

        {/* 3. Education */}
        <Card className="p-4 mb-4">
          <h5>3. Education</h5>
          <Row>
            <Col>
              <Form.Control name="degree" placeholder="Degree Name" onChange={(e) => handleChange(e, "education")} />
            </Col>
            <Col>
              <Form.Control name="institution" placeholder="Institution" onChange={(e) => handleChange(e, "education")} />
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <Form.Control name="duration" placeholder="Duration (e.g., 2021-2025)" onChange={(e) => handleChange(e, "education")} />
            </Col>
            <Col>
              <Form.Control name="cgpa" placeholder="CGPA or Percentage" onChange={(e) => handleChange(e, "education")} />
            </Col>
            <Col>
              <Form.Control name="location" placeholder="Location" onChange={(e) => handleChange(e, "education")} />
            </Col>
          </Row>
        </Card>

        {/* 4. Technical Skills */}
        <Card className="p-4 mb-4">
          <h5>4. Technical Skills (Comma-separated)</h5>
          <Form.Control className="mb-2" name="programming" placeholder="Programming Languages (e.g., Python, JavaScript)" onChange={(e) => handleChange(e, "techSkills")} />
          <Form.Control className="mb-2" name="frameworks" placeholder="Frameworks & Libraries (e.g., React, Node.js)" onChange={(e) => handleChange(e, "techSkills")} />
          <Form.Control className="mb-2" name="tools" placeholder="Tools & Platforms (e.g., Git, Docker, AWS)" onChange={(e) => handleChange(e, "techSkills")} />
          <Form.Control name="security" placeholder="Security/Domain Skills (e.g., SQL Injection, OWASP)" onChange={(e) => handleChange(e, "techSkills")} />
        </Card>

        {/* 5. Soft Skills */}
        <Card className="p-4 mb-4">
          <h5>5. Soft Skills (Comma-separated)</h5>
          <Form.Control name="softSkills" placeholder="E.g., Communication, Teamwork, Problem Solving" onChange={handleChange} />
        </Card>

        {/* 6. Projects */}
        <Card className="p-4 mb-4">
          <h5>6. Projects</h5>
          {form.projects.map((proj, idx) => (
            <div key={idx} className="mb-3 p-3 border rounded">
              <Form.Control className="mb-2" placeholder="Project Name" value={proj.name} onChange={(e) => handleChange(e, "projects", idx, "name")} />
              <Form.Control className="mb-2" placeholder="Duration / Hackathon" value={proj.duration} onChange={(e) => handleChange(e, "projects", idx, "duration")} />
              <Form.Control className="mb-2" placeholder="Technologies Used (Comma-separated)" value={proj.tools} onChange={(e) => handleChange(e, "projects", idx, "tools")} />
              <Form.Control as="textarea" placeholder="Project Description" value={proj.description} onChange={(e) => handleChange(e, "projects", idx, "description")} />
            </div>
          ))}
          <Button variant="outline-primary" onClick={() => addSection("projects")}>+ Add Project</Button>
        </Card>

        {/* 7. Experience */}
        <Card className="p-4 mb-4">
          <h5>7. Internships / Work Experience</h5>
          {form.experience.map((exp, idx) => (
            <div key={idx} className="mb-3 p-3 border rounded">
              <Form.Control className="mb-2" placeholder="Role" value={exp.role} onChange={(e) => handleChange(e, "experience", idx, "role")} />
              <Form.Control className="mb-2" placeholder="Company" value={exp.company} onChange={(e) => handleChange(e, "experience", idx, "company")} />
              <Form.Control className="mb-2" placeholder="Duration" value={exp.duration} onChange={(e) => handleChange(e, "experience", idx, "duration")} />
              <Form.Control as="textarea" placeholder="Key Responsibilities (one per line)" value={exp.responsibilities} onChange={(e) => handleChange(e, "experience", idx, "responsibilities")} />
            </div>
          ))}
           <Button variant="outline-primary" onClick={() => addSection("experience")}>+ Add Experience</Button>
        </Card>

        {/* 8. Certifications */}
        <Card className="p-4 mb-4">
          <h5>8. Certifications</h5>
          {form.certifications.map((cert, idx) => (
            <div key={idx} className="mb-3 p-3 border rounded">
              <Form.Control className="mb-2" placeholder="Course Name" value={cert.name} onChange={(e) => handleChange(e, "certifications", idx, "name")} />
              <Form.Control className="mb-2" placeholder="Issuing Body" value={cert.issuer} onChange={(e) => handleChange(e, "certifications", idx, "issuer")} />
              <Form.Control placeholder="Date" value={cert.date} onChange={(e) => handleChange(e, "certifications", idx, "date")} />
            </div>
          ))}
          <Button variant="outline-primary" onClick={() => addSection("certifications")}>+ Add Certification</Button>
        </Card>

        <div className="text-center mt-4">
          <Button variant="success" onClick={handleGeneratePdf} disabled={loading}>
            {loading ? "Generating PDF..." : "Download PDF Resume"}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default BuildResume;
