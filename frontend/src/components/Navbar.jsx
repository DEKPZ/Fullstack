// src/components/Navbar.jsx
import React from "react";
import { Navbar, Nav, Dropdown, Container, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Navbar.css";

const NavigationBar = () => {
  return (
    <Navbar className="navbar-container" expand="lg">
      <Container>
        <Link to="/" className="logo-container">
          <Image src={logo} className="logo-image" alt="logo" />
          <span className="app-name">I-Intern</span>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto navbar-links">

            <Link to="/about" className="nav-link">About</Link>
            <Link to="/internships" className="nav-link">Internships</Link>

            {/* Register Dropdown */}
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic" className="register-dropdown-button">
                Register
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/register-student">
                  Register as Intern
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/register-employer">
                  Register as Employer
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Link to="/login" className="nav-link">Login</Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
