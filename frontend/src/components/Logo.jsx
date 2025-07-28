// Logo.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Logo.css";
import logo from "../assets/logo.png"; // Adjust path if needed

const Logo = () => {
  return (
    <div className="logo-container">
      <Link to="/">
        <img src={logo} alt="I-Intern Logo" className="logo-image" />
        <span className="app-name">I-Intern</span>
      </Link>
    </div>
  );
};

export default Logo;
