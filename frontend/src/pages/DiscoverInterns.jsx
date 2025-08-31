import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Spinner, Alert, Modal, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { fetchMatchedStudents, offerInternship, fetchEmployerInternships } from "../api";
import { Search as SearchIcon } from 'lucide-react';
import "./DiscoverInterns.css";

// The OfferModal component requires no changes.
const OfferModal = ({ show, onHide, student, employerInternships, onOffer }) => {
    const [selectedInternship, setSelectedInternship] = useState('');
    const [isOffering, setIsOffering] = useState(false);

    const handleSendOffer = async () => {
        if (!selectedInternship) {
            alert("Please select an internship to offer.");
            return;
        }
        setIsOffering(true);
        await onOffer(selectedInternship);
        setIsOffering(false);
    };
    
    useEffect(() => {
        if (show) {
            setSelectedInternship('');
        }
    }, [show]);

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Offer Internship to {student?.user.first_name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Select one of your active internships to offer.</p>
                {employerInternships.length > 0 ? (
                    <Form.Group>
                        <Form.Label>Available Internships</Form.Label>
                        <Form.Select value={selectedInternship} onChange={(e) => setSelectedInternship(e.target.value)}>
                            <option value="">-- Select an Internship --</option>
                            {employerInternships.map(internship => (
                                <option key={internship.id} value={internship.id}>
                                    {internship.title}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                ) : (
                    <Alert variant="info">You have no active internships to offer. Please post one first.</Alert>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Cancel</Button>
                <Button variant="success" onClick={handleSendOffer} disabled={isOffering || employerInternships.length === 0}>
                    {isOffering ? 'Sending...' : 'Send Offer'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};


const DiscoverInterns = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [allInterns, setAllInterns] = useState([]); // Stores the master list of all interns
    const [filteredInterns, setFilteredInterns] = useState([]); // Stores the list to be displayed
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // For the offer modal
    const [showModal, setShowModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [myInternships, setMyInternships] = useState([]);

    // --- 1. Fetch all interns when the component first loads ---
    useEffect(() => {
        const loadAllInterns = async () => {
            try {
                setLoading(true);
                setError(null);
                // Send an empty query to the backend to get all students
                const data = await fetchMatchedStudents('');
                setAllInterns(data);
                setFilteredInterns(data); // Initially, the displayed list is the full list
                if (data.length === 0) {
                    setError("No interns have signed up yet.");
                }
            } catch (err) {
                setError("Failed to fetch interns. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        loadAllInterns();
    }, []); // Empty dependency array means this runs only once on mount

    // --- 2. Filter the list of interns whenever the search query changes ---
    useEffect(() => {
        const query = searchQuery.toLowerCase();
        if (!query) {
            setFilteredInterns(allInterns); // If search is empty, show all interns
            return;
        }

        // Filter the master list based on the search query
        const filtered = allInterns.filter(({ user, student_profile }) => {
            const name = `${user.first_name} ${user.last_name}`.toLowerCase();
            const skills = student_profile?.skills?.toLowerCase() || '';
            const bio = student_profile?.bio?.toLowerCase() || '';
            return name.includes(query) || skills.includes(query) || bio.includes(query);
        });

        setFilteredInterns(filtered);
    }, [searchQuery, allInterns]);


    // --- Modal functions (unchanged) ---
    const handleOpenOfferModal = async (student) => {
        setSelectedStudent(student);
        setShowModal(true);
        try {
            const internshipsData = await fetchEmployerInternships();
            setMyInternships(internshipsData.filter(i => i.is_active));
        } catch (err) {
            setError("Could not load your internships to make an offer.");
        }
    };

    const handleOffer = async (internshipId) => {
        try {
            await offerInternship(internshipId, selectedStudent.user.id);
            alert(`Offer for '${myInternships.find(i => i.id === parseInt(internshipId))?.title}' sent successfully to ${selectedStudent.user.first_name}!`);
            setShowModal(false);
            setSelectedStudent(null);
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to send offer. The student may have already applied or been offered this role.");
        }
    };

    return (
        <>
            <div className="discover-interns-container">
                <h2 className="discover-interns-title">Discover & Hire Interns</h2>
                <p className="discover-interns-subtitle">
                    Browse all available interns or search by keywords to find the perfect match for your roles.
                </p>

                <Container>
                    {/* The form no longer needs an onSubmit handler */}
                    <Form className="search-form" onSubmit={(e) => e.preventDefault()}>
                        <div className="search-bar-wrapper">
                            <SearchIcon className="search-bar-icon" />
                            <Form.Control
                                type="text"
                                className="search-input"
                                placeholder="Filter by name, skill, or keyword..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </Form>

                    <Row className="mt-5">
                        {loading && <div className="text-center w-100"><Spinner animation="border" /></div>}
                        
                        {!loading && error && <Alert variant="warning" className="mt-4">{error}</Alert>}

                        {!loading && !error && filteredInterns.length === 0 && searchQuery && (
                            <Alert variant="info" className="mt-4">No interns match your filter criteria.</Alert>
                        )}
                        
                        {!loading && filteredInterns.map(({ user, student_profile, match_score }) => (
                            <Col md={6} lg={4} key={user.id} className="mb-4">
                                <Card className="intern-card h-100">
                                    <Card.Body className="d-flex flex-column">
                                        <div>
                                            <div className="d-flex justify-content-between align-items-start">
                                                <Card.Title className="intern-name">{user.first_name} {user.last_name}</Card.Title>
                                                {/* Only show the match score badge if there is an active search query */}
                                                {searchQuery && <Badge bg="success" className="match-badge">{match_score}% Match</Badge>}
                                            </div>
                                            <Card.Text className="intern-bio">{student_profile?.bio || 'No bio provided.'}</Card.Text>
                                        </div>
                                        
                                        <div className="skills-section mt-auto">
                                            <h6>Top Skills:</h6>
                                            <div className="skills-container">
                                                {(student_profile?.skills?.split(',').slice(0, 4) || []).map((skill, i) => (
                                                    skill.trim() && <Badge key={i} pill bg="light" text="dark" className="skill-pill">{skill.trim()}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="card-actions">
                                             <Button variant="outline-primary" size="sm" onClick={() => navigate(`/applicant/${user.id}`)}>
                                                View Profile
                                            </Button>
                                            <Button variant="primary" size="sm" onClick={() => handleOpenOfferModal({user, student_profile})}>
                                                Offer Internship
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>
            
            <OfferModal 
                show={showModal}
                onHide={() => setShowModal(false)}
                student={selectedStudent}
                employerInternships={myInternships || []}
                onOffer={handleOffer}
            />
        </>
    );
};

export default DiscoverInterns;