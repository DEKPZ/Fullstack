import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import "./Footer.css";
import logo from "../assets/wb-logo.png"; // Ensure the logo path is correct

const Footer = () => {
  return (
    <div className="footer-container">
      {/* Logo and App Name */}
      <div className="footer-logo-container">
        <img src={logo} alt="I-Intern Logo" className="footer-logo-image" />
        <span className="footer-app-name">I-Intern</span>
      </div>

      {/* Navigation Links */}
      <div className="footer-links">
        <Link to="/" className="footer-link">Home</Link>
        <Link to="/about" className="footer-link">About Us</Link>
        <Link to="/contact" className="footer-link">Contact Us</Link>
        <Link to="/privacy" className="footer-link">Privacy Policy</Link>
      </div>

      {/* Social Media Icons */}
      <div className="footer-social-icons">
        <a href="https://www.facebook.com" className="social-icon" target="_blank" rel="noopener noreferrer">
          <FaFacebook />
        </a>
        <a href="https://www.twitter.com" className="social-icon" target="_blank" rel="noopener noreferrer">
          <FaTwitter />
        </a>
        <a href="https://www.linkedin.com/company/i-intern/" className="social-icon" target="_blank" rel="noopener noreferrer">
          <FaLinkedin />
        </a>
        <a href="https://www.instagram.com/i.intern_com/" className="social-icon" target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </a>
      </div>

      {/* Copyright */}
      <div className="footer-copyright">
        &copy; {new Date().getFullYear()} I-Intern. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
