import React from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container className="not-found-container">
      <div className="not-found-content">
        <h1 className="error-code">404</h1>
        <h3 className="error-title">Oops! Page not found</h3>
        <p className="error-message">
          The page you are looking for might have been removed or does not exist.
        </p>
        <Button variant="primary" onClick={() => navigate("/")}>
          Go to Home
        </Button>
      </div>
    </Container>
  );
};

export default NotFound;
