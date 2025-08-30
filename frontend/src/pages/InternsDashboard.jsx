import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";
import { Alert, Button, Badge, Form, Card, Spinner } from "react-bootstrap";
import { X, Search as SearchIcon } from 'lucide-react';
import {
    fetchCurrentUser,
    fetchMyStudentProfile,
    fetchMyApplications,
    fetchRecommendedInternships,
    fetchInternshipDetail,
    // applyToInternship is no longer used directly on this page
    studentUpdateApplicationStatus 
} from "../api";
import "./Dashboard.css";

// Helper function for the pop-up search screen
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

// This is the full-screen "YouTube-style" search component
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
                setError("Failed to load recommendations.");
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
                <h3>Search & Discover Internships</h3>
                <Button variant="light" onClick={onClose} className="close-btn"><X /></Button>
            </div>
            <div className="search-overlay-body">
                <Form.Control type="text" placeholder="Filter recommendations by title, location, or skill..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input-overlay mb-4" autoFocus />
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
                                                <Card.Subtitle className="mb-2 text-muted">{internship.location} | {internship.duration}</Card.Subtitle>
                                            </div>
                                            <Badge bg="success" className="match-score-badge">{internship.match_score}% Match</Badge>
                                        </div>
                                    </Card.Body>
                                </Card>
                            ))
                        ) : ( <Alert variant="info">No matching recommendations found.</Alert> )}
                    </div>
                )}
            </div>
        </div>
    );
};


/* -------------------------
   Main Dashboard Component
   ------------------------- */
const InternsDashboard = () => {
    const [applications, setApplications] = useState([]);
    const [recommendedInternships, setRecommendedInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null); 
    const [credits, setCredits] = useState(0);
    const [showSearch, setShowSearch] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [userData, profileData, applicationsData, recommendationsData] = await Promise.all([
                    fetchCurrentUser(),
                    fetchMyStudentProfile(),
                    fetchMyApplications(),
                    fetchRecommendedInternships()
                ]);

                const combinedUser = {
                    name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
                    email: userData.email,
                    phone: userData.phone_number || "+91 9876543210", 
                    photo: userData.profile_picture_url || null,
                    skills: profileData.skills ? profileData.skills.split(',').map(s => s.trim()) : ["Add your skills"],
                };
                setUser(combinedUser);
                setCredits(userData.credits);

                const applicationsWithDetails = await Promise.all(
                    applicationsData.map(async (app) => {
                        const internshipDetails = await fetchInternshipDetail(app.internship_id);
                        return { ...app, internship: internshipDetails };
                    })
                );
                setApplications(applicationsWithDetails);
                setRecommendedInternships(recommendationsData);

            } catch (err) {
                console.error("Dashboard fetch error:", err);
                setError("Failed to load dashboard data. You might need to log in again.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="loading-state"><h1>Loading Dashboard...</h1></div>;
    if (error) return <div className="error-state"><h1>{error}</h1></div>;

    return (
        <>
            {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} />}
            <div className="dashboard">
                <main className="dashboard-grid" role="main">
                    <section className="left-column" aria-label="Profile and Offers">
                        <ProfileCard user={user} />
                        <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
                            <button
                                className="btn primary large"
                                onClick={() => navigate('/build-resume')}
                            >
                                Build Resume
                            </button>
                        </div>
                        <OffersSection />
                    </section>

                    <section className="middle-column" aria-label="Overview and Applications">
                        <WelcomeOverview userName={user?.name || "Intern"} credits={credits} />
                        <InternshipApplicationTracker applications={applications} setApplications={setApplications} />
                    </section>

                    <aside className="right-column" aria-label="Internship Search">
                        <InternshipSearch
                            recommendations={recommendedInternships}
                            loading={loading}
                            onFindMoreClick={() => setShowSearch(true)}
                        />
                    </aside>
                </main>
            </div>
        </>
    );
};

/* --- Child Components --- */

function ProfileCard({ user }) {
    const navigate = useNavigate();
    const fileInputRef = useRef();

    return (
        <section className="card profile-card" aria-labelledby="profile-title">
            <div className="card-header">
                <h2 id="profile-title">Profile</h2>
                <button className="btn-text" onClick={() => navigate('/my-profile')}>View Profile</button>
            </div>
            <div className="profile-body">
                <div className="avatar">
                    {user?.photo ? <img src={user.photo} alt={user.name} /> : <div className="avatar-placeholder">{user?.name?.[0]}</div>}
                </div>
                <div className="profile-info">
                    <h3>{user?.name}</h3>
                    <p className="muted">{user?.email}</p>
                    <p className="muted">{user?.phone}</p>
                    <div className="skill-list">
                        {user?.skills.map((s, i) => <span className="chip" key={i}>{s}</span>)}
                    </div>
                    <div className="profile-actions">
                        <button className="btn" onClick={() => navigate('/my-profile')}>Edit Profile</button>
                        <button className="btn" onClick={() => fileInputRef.current.click()}>Upload Resume</button>
                        <input type="file" ref={fileInputRef} onChange={() => alert("Resume upload logic here.")} style={{ display: 'none' }} />
                    </div>
                </div>
            </div>
        </section>
    );
}

function OffersSection({ offers = [] }) {
    return (
        <section className="card offers-card" aria-labelledby="offers-title">
            <div className="card-header"><h2 id="offers-title">Offers</h2></div>
            <div className="offers-body">
                 {offers.length === 0 && <div className="muted-text">No pending offers.</div>}
            </div>
        </section>
    );
}

function WelcomeOverview({ userName, credits }) {
    const creditScorePercent = Math.round((credits / 5) * 100);
    return (
        <section className="card welcome-card" aria-labelledby="welcome-title">
            <div className="card-header">
                <h2 id="welcome-title">Welcome back, {userName}!</h2>
            </div>
            <div className="welcome-body">
                <div className="credits-display">
                    <div className="credits-number">{credits}</div>
                    <div className="credits-label">Credits Available</div>
                    <div className="credits-usage">{credits}/5 credits used this month.</div>
                </div>
                <div className="credits-chart">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={12} data={[{ name: "Credits", value: creditScorePercent, fill: "#00c49f" }]} startAngle={90} endAngle={-270}>
                            <RadialBar minAngle={15} clockWise dataKey="value" cornerRadius={10} background={{ fill: '#eee' }} />
                            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="progress-label">{creditScorePercent}%</text>
                        </RadialBarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="welcome-actions">
                 <Button variant="success">Upgrade to Premium for ₹199</Button>
            </div>
        </section>
    );
}

function InternshipApplicationTracker({ applications, setApplications }) {
    function withdrawApplication(id) {
        setApplications((prev) => prev.filter((a) => a.id !== id));
    }
    return (
        <section className="card tracker-card" aria-labelledby="tracker-title">
            <div className="card-header"><h2 id="tracker-title">Applications Tracker</h2></div>
            <div className="tracker-body">
                {applications.length === 0 ? <div className="muted-text">No applications yet.</div> : (
                    <ul className="apps-list">
                        {applications.map((app) => (
                            <li key={app.id} className="app-item">
                                <div className="app-main">
                                    <strong>{app.internship.title}</strong>
                                    <div className={`status-badge status-${app.status.toLowerCase()}`}>{app.status}</div>
                                </div>
                                <div className="app-actions">
                                    <button className="btn-text small" onClick={() => withdrawApplication(app.id)}>Withdraw</button>
                                    <button className="btn-text small">Follow-up</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}

function InternshipSearch({ recommendations, loading, onFindMoreClick }) {
    const navigate = useNavigate();

    const handleViewDetails = (internshipId) => {
        navigate(`/internship-detail/${internshipId}`);
    };

    return (
        <section className="card search-card" aria-labelledby="search-title">
            <div className="card-header">
                <h2 id="search-title">Find Internships</h2>
            </div>
            
            <div style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
                 <Button variant="primary" className="w-100" onClick={onFindMoreClick}>
                    <SearchIcon size={18} className="me-2" />
                    Open Smart Search
                </Button>
            </div>

            <div className="recommended" style={{ padding: '1rem' }}>
                <h4>Recommended for you</h4>
                {loading && <div className="muted-text">Loading...</div>}
                {!loading && recommendations.length === 0 && <div className="muted-text">No recommendations available.</div>}
                <ul className="rec-list">
                    {recommendations.map((r) => (
                        <li key={r.id} className="rec-item">
                            <div className="rec-details">
                                <div className="d-flex justify-content-between align-items-start">
                                    <strong>{r.title}</strong>
                                    {r.match_score != null && (
                                        <Badge bg="success" pill>{r.match_score}% Match</Badge>
                                    )}
                                </div>
                                <div className="muted small">{r.location} • {r.duration} • {r.stipend}</div>
                            </div>
                            <div className="rec-actions">
                                <button className="btn primary" onClick={() => handleViewDetails(r.id)}>
                                    Apply
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

export default InternsDashboard;