import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import RegisterStudent from "./pages/RegisterStudent";
import RegisterEmployer from "./pages/RegisterEmployer";
import Login from "./pages/Login";
import Contact from "./pages/contact";
import Internships from "./pages/Internships";
import InternshipDetail from "./pages/InternshipDetail";
import InternsDashboard from "./pages/InternsDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import PostInternship from "./pages/PostInternship";
import HiredInterns from "./pages/HiredInterns";
import BuildResume from "./pages/BuildResume";
import ApplyPage from "./pages/ApplyPage";
import Privacy from "./pages/Privacy";
import ViewApplicants from "./pages/ViewApplicants";
import AdminDashboard from "./pages/AdminDashboard";
import ApplicantProfile from "./pages/ApplicantProfile";
import ManageUsers from "./pages/ManageUsers";
import ManageInternships from "./pages/ManageInternships";
import ProfilePage from "./pages/ProfilePage"; // This import was already correct
import NotFound from "./pages/NotFound";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/register-student" element={<RegisterStudent />} />
          <Route path="/register-employer" element={<RegisterEmployer />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/interns" element={<InternsDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/InternshipDetail" element={<InternshipDetail />} />
          <Route path="/employer" element={<EmployerDashboard />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/post-internship" element={<PostInternship />} />
          <Route path="/hired-interns" element={<HiredInterns />} />
          <Route path="/build-resume" element={<BuildResume />} />
          <Route path="/apply/:id" element={<ApplyPage />} />
          <Route path="/privacy" element={<Privacy />} />
          
          {/* --- MODIFICATIONS START HERE --- */}

          {/* 1. Added a route for the general profile page */}
          <Route path="/profile" element={<ProfilePage />} />

          {/* 2. Updated the applicants route to accept an internshipId */}
          <Route path="/view-applicants/:internshipId" element={<ViewApplicants />} />
          
          {/* 3. Updated the applicant profile route to accept an applicantId */}
          <Route path="/applicant/:applicantId" element={<ApplicantProfile />} />
          
          {/* --- MODIFICATIONS END HERE --- */}
          
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/internships" element={<ManageInternships />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
