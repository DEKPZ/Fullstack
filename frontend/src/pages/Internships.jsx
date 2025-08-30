import React, { useState, useEffect } from "react";
import { Card, Button, Badge, Container, Row, Col, Spinner, Alert, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { fetchInternships, fetchRecommendedInternships } from "../api";
import { Search as SearchIcon, X } from 'lucide-react';
import "./Internships.css";

// A simple debounce hook to prevent API calls on every keystroke
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

// Search Overlay Component integrated directly
const SearchOverlay = ({ onClose }) => {
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
        const loadRecommendations = async () => {
            try {
                setLoading(true);
                const data = await fetchRecommendedInternships();
                setRecommendations(data);
                setFilteredResults(data);
            } catch (err) {
                setError("Failed to load recommendations. Please ensure you are logged in as a student.");
            } finally {
                setLoading(false);
            }
        };
        loadRecommendations();
    }, []);

    useEffect(() => {
        if (debouncedSearchTerm) {
            const lowercasedTerm = debouncedSearchTerm.toLowerCase();
            const filtered = recommendations.filter(internship =>
                internship.title.toLowerCase().includes(lowercasedTerm) ||
                internship.location.toLowerCase().includes(lowercasedTerm) ||
                (internship.skills_required && internship.skills_required.toLowerCase().includes(lowercasedTerm))
            );
            setFilteredResults(filtered);
        } else {
            setFilteredResults(recommendations);
        }
    }, [debouncedSearchTerm, recommendations]);

    return (
        <div className="search-overlay">
            <div className="search-overlay-header">
                <h3>Search Recommended Internships</h3>
                <Button variant="light" onClick={onClose} className="close-btn"><X /></Button>
            </div>
            <div className="search-overlay-body">
                <Form.Control
                    type="text"
                    placeholder="Filter recommendations by title, location, or skill..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input-overlay mb-4"
                    autoFocus
                />
                {loading && <div className="text-center p-5"><Spinner animation="border" /></div>}
                {error && <Alert variant="danger">{error}</Alert>}
                {!loading && !error && (
                    <div className="search-results">
                        {filteredResults.length > 0 ? (
                             filteredResults.map(internship => (
                                <Card key={internship.id} className="mb-3 search-result-card" onClick={() => navigate(`/internship-detail/${internship.id}`)}>
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <Card.Title className="search-card-title">{internship.title}</Card.Title>
                                                <Card.Subtitle className="mb-2 text-muted">
                                                    {internship.location} | {internship.duration}
                                                </Card.Subtitle>
                                            </div>
                                            <Badge bg="success" className="match-score-badge">{internship.match_score}% Match</Badge>
                                        </div>
                                    </Card.Body>
                                </Card>
                            ))
                        ) : (
                            <Alert variant="info">No matching recommendations found for '{searchTerm}'.</Alert>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};


const InternshipsPage = () => { 
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const loadInternships = async () => {
      try {
        const data = await fetchInternships();
        setInternships(data);
      } catch (err) {
        console.error("Error fetching internships:", err);
        setError("Failed to fetch internships. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadInternships();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/internship-detail/${id}`);
  };

  if (loading) {
    return <div className="loading text-center p-5"><Spinner animation="border" /></div>;
  }

  return (
    <>
      {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} />}
      
      <div className="internship-container">
        <h2 className="internship-title">Available Internships</h2>

        <Container className="mb-5">
            <div className="search-bar-wrapper" onClick={() => setShowSearch(true)}>
                <SearchIcon className="search-bar-icon" />
                <span className="search-bar-placeholder">
                    Click to open smart search & view personalized recommendations...
                </span>
            </div>
        </Container>

        {error && <Alert variant="danger" className="m-3">{error}</Alert>}
        
        <Container>
          <Row>
            {internships.map((internship) => (
              <Col md={6} lg={4} key={internship.id} className="mb-4">
                <Card className="internship-card-display">
                  <Card.Body>
                    <Card.Title className="internship-job-title">{internship.title}</Card.Title>
                    <div className="internship-details">
                      <p><strong>Location:</strong> {internship.location}</p>
                      <p><strong>Duration:</strong> {internship.duration || "N/A"}</p>
                      <p><strong>Stipend:</strong> {internship.stipend || "N/A"}</p>
                    </div>
                    <Button 
                      className="internship-action-button" 
                      onClick={() => handleViewDetails(internship.id)}
                    >
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </>
  );
};

export default InternshipsPage;