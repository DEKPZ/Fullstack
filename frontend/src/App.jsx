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
import Contact from "./pages/Contact"; // Corrected capitalization
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
import ProfilePage from "./pages/ProfilePage";
import MyInternships from "./pages/MyInternships"; // 1. Import the new page component
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
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/view-applicants/:internshipId" element={<ViewApplicants />} />
          <Route path="/applicant/:applicantId" element={<ApplicantProfile />} />
          
          {/* 2. Add the new route for employers to see their internships */}
          <Route path="/employer/my-internships" element={<MyInternships />} />

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
