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
import Contact from "./pages/Contact";
import Internships from "./pages/Internships";
import InternshipDetail from "./pages/InternshipDetail";
import InternshipDescription from "./pages/InternshipDescription";
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
import MyInternships from "./pages/MyInternships";
import StudentProfileDisplay from "./pages/StudentProfileDisplay";
import EmployerProfilePage from "./pages/EmployerProfilepage"; // <-- ADDED
import NotFound from "./pages/NotFound";
import "./App.css";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import ChatWidget from './components/ChatWidget';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="content-wrap">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/register-student" element={<RegisterStudent />} />
            <Route path="/register-employer" element={<RegisterEmployer />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/interns" element={<InternsDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/internship-detail/:internshipId" element={<InternshipDetail />} />
            <Route path="/internship-description/:internshipId" element={<InternshipDescription />} />
            <Route path="/employer" element={<EmployerDashboard />} />
            <Route path="/internships" element={<Internships />} />
            <Route path="/post-internship" element={<PostInternship />} />
            <Route path="/hired-interns" element={<HiredInterns />} />
            <Route path="/build-resume" element={<BuildResume />} />
            <Route path="/apply/:id" element={<ApplyPage />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/my-profile" element={<StudentProfileDisplay />} />
            <Route path="/student-profile/:studentId" element={<StudentProfileDisplay />} />
            <Route path="/view-applicants/:internshipId" element={<ViewApplicants />} />
            <Route path="/applicant/:applicantId" element={<ApplicantProfile />} />
            <Route path="/employer/my-internships" element={<MyInternships />} />
            <Route path="/employer/profile" element={<EmployerProfilePage />} /> {/* <-- ADDED */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/internships" element={<ManageInternships />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} /> 
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <ChatWidget />
      </div>
    </Router>
  );
};

export default App;