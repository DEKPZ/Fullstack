import React from "react";
import { Card, Button } from "react-bootstrap";
import "./Privacy.css";

const Privacy = () => {
  return (
    <div className="privacy-container">
      <Card className="privacy-card">
        <h2 className="privacy-title">Privacy Policy</h2>
        <div className="privacy-content">
          <p>
            Welcome to <span className="privacy-highlight">I-Intern</span>. We value your privacy and are committed to protecting your personal information. This policy outlines how we collect, use, and safeguard your data.
          </p>

          <h3 className="privacy-subtitle">1. Information We Collect</h3>
          <p>
            We collect personal information when you register, apply for internships, or interact with our services. This may include:
          </p>
          <ul className="privacy-list">
            <li>Personal details (Name, Email, Phone Number, Address)</li>
            <li>Profile information (Skills, Education, Experience)</li>
            <li>Login credentials (Username, Password)</li>
            <li>Device and usage data (IP address, Browser type)</li>
          </ul>

          <h3 className="privacy-subtitle">2. How We Use Your Information</h3>
          <p>Your information helps us:</p>
          <ul className="privacy-list">
            <li>Connect students with employers for internship opportunities</li>
            <li>Improve our platform and services</li>
            <li>Send updates and notifications</li>
            <li>Ensure the security of your account</li>
          </ul>

          <h3 className="privacy-subtitle">3. Data Protection</h3>
          <p>
            We implement industry-standard measures to protect your data. However, no method of transmission over the internet is entirely secure.
          </p>

          <h3 className="privacy-subtitle">4. Sharing of Information</h3>
          <p>
            We do not share your personal information with third parties except when necessary to provide services or comply with the law.
          </p>

          <h3 className="privacy-subtitle">5. Your Rights</h3>
          <p>
            You have the right to access, update, or delete your personal information. Please contact us for assistance.
          </p>

          <h3 className="privacy-subtitle">6. Changes to This Policy</h3>
          <p>
            We may update this policy periodically. Changes will be posted on this page.
          </p>

          <h3 className="privacy-subtitle">7. Contact Us</h3>
          <p>
            For questions or concerns, reach out to <span className="privacy-highlight">support@i-intern.com</span>.
          </p>
        </div>
        <Button className="privacy-button">Back to Home</Button>
      </Card>
    </div>
  );
};

export default Privacy;
