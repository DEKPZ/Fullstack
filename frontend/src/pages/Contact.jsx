import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-container">
      <Container className="contact-card">
        <h2 className="contact-title">Get in Touch</h2>
        <p className="contact-subtitle">
          We'd love to hear from you! Feel free to reach out with any questions, suggestions, or feedback.
        </p>
        
        <Form className="contact-form">
          <Row>
            <Col md={6} className="form-group">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter your name" />
            </Col>
            <Col md={6} className="form-group">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter your email" />
            </Col>
          </Row>
          
          <Row>
            <Col md={12} className="form-group">
              <Form.Label>Subject</Form.Label>
              <Form.Control type="text" placeholder="Enter the subject" />
            </Col>
          </Row>
          
          <Row>
            <Col md={12} className="form-group">
              <Form.Label>Message</Form.Label>
              <Form.Control as="textarea" rows={5} placeholder="Enter your message" />
            </Col>
          </Row>

          <Button className="contact-button" type="submit">Send Message</Button>
        </Form>
      </Container>
    </div>
  );
};

export default Contact;
