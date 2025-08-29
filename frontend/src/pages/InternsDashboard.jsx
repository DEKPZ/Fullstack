import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";
import { Alert, Button, Badge } from "react-bootstrap";
// API functions to fetch real data from the backend
import {
    fetchCurrentUser,
    fetchMyStudentProfile,
    fetchMyApplications,
    fetchRecommendedInternships, // Changed from fetchInternships
    fetchInternshipDetail,
    applyToInternship,
} from "../api";
import "./Dashboard.css";

/* -------------------------
   Main Dashboard Component
   ------------------------- */
const InternsDashboard = () => {
    // --- State Management ---
    const [applications, setApplications] = useState([]);
    const [recommendedInternships, setRecommendedInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null); // Will hold current user data
    const [profile, setProfile] = useState(null); // Will hold student profile data
    const [stats, setStats] = useState({ credits: 5 }); // Can be dynamic later
    const [favorites, setFavorites] = useState([]);
    const [searchFilters, setSearchFilters] = useState({ q: "", location: "", role: "", duration: "" });
    const [credits, setCredits] = useState(0);
    const [offers, setOffers] = useState([]);
    const [ongoingInternships, setOngoingInternships] = useState([]);
    const [otherApplications, setOtherApplications] = useState([]);

    const navigate = useNavigate();

    // --- Data Fetching ---
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch all data in parallel for faster loading
                const [userData, profileData, applicationsData, recommendationsData] = await Promise.all([
                    fetchCurrentUser(),
                    fetchMyStudentProfile(),
                    fetchMyApplications(),
                    fetchRecommendedInternships() // Fetch personalized recommendations
                ]);

                // Combine user and profile data for the ProfileCard
                const combinedUser = {
                    name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
                    email: userData.email,
                    phone: userData.phone_number || "+91 9876543210", // Placeholder
                    photo: userData.profile_picture_url || null,
                    skills: profileData.skills ? profileData.skills.split(',').map(s => s.trim()) : ["Add your skills"],
                };
                setUser(combinedUser);
                setProfile(profileData);
                setCredits(userData.credits);

                // Fetch full details for each application's internship
                const applicationsWithDetails = await Promise.all(
                    applicationsData.map(async (app) => {
                        const internshipDetails = await fetchInternshipDetail(app.internship_id);
                        return { ...app, internship: internshipDetails };
                    })
                );
                setApplications(applicationsWithDetails);

                // Set the fetched recommendations directly
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
    const handleTopUp = async () => {
        try {
            const updatedUser = await axios.post(
                `${API_BASE_URL}/users/me/top-up-credits`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${getAuthToken()}`,
                    },
                }
            );
            setCredits(updatedUser.data.credits);
            alert('You have successfully topped up 2 credits!');
        } catch (error) {
            console.error('Error topping up credits:', error);
            alert('Failed to top up credits. Please try again.');
        }
    };

    // --- Render Logic ---
    if (loading) return <div className="loading-state"><h1>Loading Dashboard...</h1></div>;
    if (error) return <div className="error-state"><h1>{error}</h1></div>;

    return (
        <div className="dashboard">
            <main className="dashboard-grid" role="main">
                <section className="left-column" aria-label="Profile and Offers">
                    {/* Pass the fetched user data to the profile card */}
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
                    {/* Pass fetched user name and application data */}
                    <WelcomeOverview stats={stats} userName={user?.name || "Intern"} credits={credits} onTopUp={handleTopUp} />
                    <InternshipApplicationTracker applications={applications} setApplications={setApplications} />
                </section>

                <aside className="right-column" aria-label="Internship Search">
                    {/* Pass fetched recommendations */}
                    <InternshipSearch
                        recommendations={recommendedInternships}
                        favorites={favorites}
                        setFavorites={setFavorites}
                        filters={searchFilters}
                        setFilters={setSearchFilters}
                        loading={loading}
                    />
                </aside>
            </main>
        </div>
    );
};

/* --- Child Components (Largely unchanged, they now receive real data via props) --- */

// --- MODIFICATION START ---
// Profile Card with Edit Functionality updated to navigate
function ProfileCard({ user }) {
    const navigate = useNavigate(); // Hook for navigation
    const fileInputRef = useRef();

    return (
        <section className="card profile-card" aria-labelledby="profile-title">
            <div className="card-header">
                <h2 id="profile-title">Profile</h2>
                {/* Updated this button to navigate */}
                <button className="btn-text" onClick={() => navigate('/profile')}>Edit</button>
            </div>
            <div className="profile-body">
                <div className="avatar">
                    {user?.photo ? <img src={user.photo} alt={user.name} /> : <div className="avatar-placeholder">{user?.name?.[0]}</div>}
                </div>
                {/* Removed the inline editing form */}
                <div className="profile-info">
                    <h3>{user?.name}</h3>
                    <p className="muted">{user?.email}</p>
                    <p className="muted">{user?.phone}</p>
                    <div className="skill-list">
                        {user?.skills.map((s, i) => <span className="chip" key={i}>{s}</span>)}
                    </div>
                    <div className="profile-actions">
                        {/* Updated this button to also navigate */}
                        <button className="btn" onClick={() => navigate('/profile')}>Edit Profile</button>
                        <button className="btn" onClick={() => fileInputRef.current.click()}>Upload Resume</button>
                        <input type="file" ref={fileInputRef} onChange={() => alert("Resume upload logic here.")} style={{ display: 'none' }} />
                    </div>
                </div>
            </div>
        </section>
    );
}
// --- MODIFICATION END ---


// Offers Section (static for now)
function OffersSection({ offers = [], onAction }) {
    
    const [loadingId, setLoadingId] = useState(null);

    const handleAccept = async (appId) => {
        setLoadingId(appId);
        try {
            await studentUpdateApplicationStatus(appId, 'hired');
            alert('Offer accepted successfully! It will now appear in "My Internships".');
            onAction(appId); // Remove from UI
        } catch (error) {
            alert('Failed to accept offer. Please try again.');
        } finally {
            setLoadingId(null);
        }
    };
    
    const handleReject = async (appId) => {
        setLoadingId(appId);
        try {
            await studentUpdateApplicationStatus(appId, 'rejected');
            alert('Offer has been rejected.');
            onAction(appId); // Remove from UI
        } catch (error) {
            alert('Failed to reject offer. Please try again.');
        } finally {
            setLoadingId(null);
        }
    };


    return (
        <section className="card offers-card" aria-labelledby="offers-title">
            <div className="card-header"><h2 id="offers-title">Offers</h2></div>
            <div className="offers-body">
                {offers.map((o) => (
                    <div key={o.id} className="offer-item">
                        <div className="offer-details">
                            <strong>{o.role}</strong>
                            <div className="muted small">{o.company} • {o.duration} • {o.stipend}</div>
                            <div className="muted tiny">Contact: {o.contact}</div>
                        </div>
                        <div className="offer-actions">
                            <button className="btn primary" onClick={() => alert(`Offer accepted: ${o.role}`)}>Accept</button>
                            <button className="btn" onClick={() => alert("Offer rejected.")}>Reject</button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

// Welcome Overview Card (receives real data)
function WelcomeOverview({ userName, credits, isPremium, premiumExpiresAt, onTopUp, onUpgrade }) {
    const navigate = useNavigate();

    // Renders the "You are on a premium trial!" banner if applicable
    const renderTrialBanner = () => {
        if (isPremium && premiumExpiresAt) {
            const expiryDate = new Date(premiumExpiresAt).toLocaleDateString("en-US", {
                year: 'numeric', month: 'long', day: 'numeric'
            });
            return (
                <Alert variant="success" className="mt-3 text-center">
                    🎉 You are on a Premium trial! Enjoy unlimited applications until **{expiryDate}**.
                </Alert>
            );
        }
        return null;
    };

    // Calculates the chart percentage for free users (5 credits = 100%)
    const creditScorePercent = !isPremium ? Math.round((credits / 5) * 100) : 100;

    return (
        <section className="card welcome-card" aria-labelledby="welcome-title">
            <div className="card-header">
                <h2 id="welcome-title">Welcome back, {userName}!</h2>
            </div>
            {renderTrialBanner()}
            <div className="welcome-body">
                <div className="credits-display">
                    {isPremium ? (
                        <>
                            <div className="credits-number">∞</div>
                            <div className="credits-label">Premium Member</div>
                            <div className="credits-usage">You have unlimited applications.</div>
                        </>
                    ) : (
                        <>
                            <div className="credits-number">{credits}</div>
                            <div className="credits-label">Credits Available</div>
                            <div className="credits-usage">{credits}/5 credits used this month.</div>
                            <Button variant="primary" onClick={onTopUp} className="mt-2">
                                Top Up Credits (₹99)
                            </Button>
                        </>
                    )}
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
             {!isPremium && (
                <div className="welcome-actions">
                    <Button variant="success" onClick={onUpgrade}>
                        Upgrade to Premium for ₹199
                    </Button>
                </div>
             )}
        </section>
    );
}




// Application Tracker Card (receives real data)
function InternshipApplicationTracker({ applications, setApplications }) {
    function withdrawApplication(id) {
        // Here you would call an API to withdraw the application
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
                                    <div className={`status-badge status-${app.status.replace(/\s+/g, '-').toLowerCase()}`}>{app.status}</div>
                                </div>
                                <div className="app-actions">
                                    <button className="btn-text small" onClick={() => withdrawApplication(app.id)}>Withdraw</button>
                                    <button className="btn-text small" onClick={() => alert(`Follow-up for ${app.internship.title}`)}>Follow-up</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}

// Internship Search Card (receives real data)
function InternshipSearch({ recommendations, favorites, setFavorites, filters, setFilters, loading }) {
    // This component now receives live recommendations
    const navigate = useNavigate();
    const [applying, setApplying] = useState(null); // State to track which internship is being applied to

    const handleApply = async (internshipId) => {
        setApplying(internshipId);
        try {
            await applyToInternship(internshipId, {
                cover_letter: "",
                status: "pending",
            });
            alert("Successfully applied!");
            // Optionally, you can refresh the applications list here
        } catch (error) {
            console.error("Error applying for internship:", error);
            alert("Failed to apply. You may have already applied for this internship or are out of credits.");
        } finally {
            setApplying(null);
        }
    };

    // Placeholder functions for the new buttons
    const handleSave = (internshipId) => {
        alert(`Saving internship: ${internshipId}`);
        // Here you can add logic to update the 'favorites' state
        // For example: setFavorites([...favorites, internshipId]);
    };

    

    const handleSearch = (e) => {
        e.preventDefault();
        alert(`Searching with filters: ${JSON.stringify(filters)}`);
        // Add your search logic here
    };

    return (
        <section className="card search-card" aria-labelledby="search-title">
            {/* --- START: Added Find Internships Form --- */}
            <div className="card-header">
                <h2 id="search-title">Find Internships</h2>
            </div>
            <form className="find-internships-form" onSubmit={handleSearch} style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input
                    type="text"
                    placeholder="Search role or company..."
                    className="form-input"
                    value={filters.q}
                    onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                />
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <input
                        type="text"
                        placeholder="City or Remote"
                        className="form-input"
                        style={{ flex: 1 }}
                        value={filters.location}
                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="e.g., 3 months"
                        className="form-input"
                        style={{ flex: 1 }}
                        value={filters.duration}
                        onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                    />
                </div>
                <button className="btn primary" type="submit">Search</button>
            </form>
            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '0 1rem' }} />
            {/* --- END: Added Find Internships Form --- */}

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
                                    {/* Display match score if available */}
                                    {r.match_score != null && (
                                        <Badge bg="success" pill>{r.match_score}% Match</Badge>
                                    )}
                                </div>
                                {/* Correctly display stipend which might be text like "Unpaid" */}
                                <div className="muted small">{r.location} • {r.duration} • {r.stipend}</div>
                            </div>
                            <div className="rec-actions">
                                {/* --- START: Added Save and Apply Buttons --- */}
                                <button className="btn" onClick={() => handleSave(r.id)}>Save</button>
                                <button className="btn primary" onClick={() => handleApply(r.id)} disabled={applying === r.id}>
                                    {applying === r.id ? 'Applying...' : 'Apply'}
                                </button>
                                {/* --- END: Added Save and Apply Buttons --- */}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

function OngoingInternshipTracker({ internships }) {
    return (
        <section className="card tracker-card" aria-labelledby="ongoing-title">
            <div className="card-header"><h2 id="ongoing-title">My Internships</h2></div>
            <div className="tracker-body">
                {internships.length === 0 ? <div className="muted-text">You have no ongoing internships.</div> : (
                    <ul className="apps-list">
                        {internships.map((app) => (
                            <li key={app.id} className="app-item">
                                <strong>{app.internship.title}</strong>
                                <span>Duration: {app.internship.duration}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}



export default InternsDashboard;