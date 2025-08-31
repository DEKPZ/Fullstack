// src/pages/InternshipDescription.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Card, Button, Spinner, Alert, Badge, Row, Col } from 'react-bootstrap';
import { fetchInternshipDetail, studentUpdateApplicationStatus } from '../api';
import { MapPin, Clock, DollarSign, Briefcase, Target, Wrench, CheckSquare, GraduationCap, Link as LinkIcon } from 'lucide-react';
import './InternshipDescription.css';

const InternshipDescription = () => {
    const { internshipId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [internship, setInternship] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if navigating from the 'offers' section and get the application ID
    const isOfferView = location.state?.from === 'offers';
    const applicationId = location.state?.applicationId;

    useEffect(() => {
        const loadInternship = async () => {
            try {
                setLoading(true);
                const data = await fetchInternshipDetail(internshipId);
                setInternship(data);
            } catch (err) {
                setError('Failed to load internship details. It might not exist or there was a network error.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (internshipId) {
            loadInternship();
        }
    }, [internshipId]);

    const handleApplyNow = () => {
        navigate(`/apply/${internshipId}`);
    };

    const handleOfferResponse = async (status) => {
        if (!applicationId) {
            setError("Application ID is missing. Cannot process the response.");
            return;
        }

        setLoading(true);
        try {
            await studentUpdateApplicationStatus(applicationId, status);
            alert(`You have successfully ${status === 'hired' ? 'accepted' : 'withdrawn'} the offer.`);
            navigate('/interns'); // Redirect back to the dashboard
        } catch (err) {
            console.error("Error responding to offer:", err);
            setError(err.response?.data?.detail || "An error occurred while responding to the offer. Please try again.");
            setLoading(false); // Stop loading on error
        }
    };

    if (loading) return <div className="text-center p-5"><Spinner animation="border" /></div>;
    if (error) return <Alert variant="danger" className="m-3" onClose={() => setError(null)} dismissible>{error}</Alert>;
    if (!internship) return <Alert variant="info" className="m-3">Internship not found.</Alert>;

    const companyName = internship.employer?.employer_profile?.company_name || 'Company Name Not Available';
    const companyWebsite = internship.employer?.employer_profile?.website;

    const splitToList = (text) => {
        if (!text) return [];
        return text.split('\n').map(item => item.trim()).filter(Boolean);
    }

    const skills = (internship.skills_required || '').split(',').map(s => s.trim()).filter(Boolean);
    const responsibilities = splitToList(internship.responsibilities);
    const qualifications = splitToList(internship.qualifications);

    return (
        <div className="internship-description-page">
            <Container>
                <Row className="justify-content-center">
                    <Col lg={9}>
                        <Card className="internship-description-card">
                            <Card.Body>
                                <header className="text-center mb-4">
                                    <h1 className="internship-title-desc">{internship.title}</h1>
                                    <h2 className="company-name-desc">
                                        {companyWebsite ? (
                                            <a href={companyWebsite} target="_blank" rel="noopener noreferrer">
                                                {companyName} <LinkIcon size={18} />
                                            </a>
                                        ) : (
                                            companyName
                                        )}
                                    </h2>
                                    <p className="posted-date-desc">Posted on: {new Date(internship.posted_date).toLocaleDateString()}</p>
                                </header>
                                
                                <div className="badges-container-desc">
                                    {internship.location && <Badge><MapPin size={14} /> {internship.location}</Badge>}
                                    {internship.duration && <Badge><Clock size={14} /> {internship.duration}</Badge>}
                                    {internship.stipend && <Badge><DollarSign size={14} /> {internship.stipend}</Badge>}
                                    {internship.job_type && <Badge><Briefcase size={14} /> {internship.job_type}</Badge>}
                                </div>

                                <section className="section-desc">
                                    <h3 className="section-title-desc"><Target size={20} /> Description</h3>
                                    <p className="section-content-desc">{internship.description}</p>
                                </section>

                                {skills.length > 0 && (
                                    <section className="section-desc">
                                        <h3 className="section-title-desc"><Wrench size={20} /> Skills Required</h3>
                                        <div className="skills-list-desc">
                                            {skills.map((skill, index) => <Badge key={index} pill bg="light" text="dark" className="skill-badge">{skill}</Badge>)}
                                        </div>
                                    </section>
                                )}

                                {responsibilities.length > 0 && (
                                    <section className="section-desc">
                                        <h3 className="section-title-desc"><CheckSquare size={20} /> Responsibilities</h3>
                                        <ul className="details-list-desc">
                                             {responsibilities.map((res, index) => <li key={index}>{res}</li>)}
                                        </ul>
                                    </section>
                                )}

                                {qualifications.length > 0 && (
                                    <section className="section-desc">
                                        <h3 className="section-title-desc"><GraduationCap size={20} /> Qualifications</h3>
                                        <ul className="details-list-desc">
                                            {qualifications.map((qual, index) => <li key={index}>{qual}</li>)}
                                        </ul>
                                    </section>
                                )}

                                <div className="text-center mt-5">
                                    {isOfferView ? (
                                        <div className="offer-actions">
                                            <Button
                                                className="accept-button-desc me-3"
                                                onClick={() => handleOfferResponse('hired')}
                                                disabled={loading}
                                            >
                                                {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Accept Offer'}
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                className="withdraw-button-desc"
                                                onClick={() => handleOfferResponse('withdrawn')}
                                                disabled={loading}
                                            >
                                                {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Withdraw'}
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button className="apply-button-desc" onClick={handleApplyNow} disabled={loading}>
                                            Apply Now
                                        </Button>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default InternshipDescription;
