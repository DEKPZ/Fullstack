import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '../api'; // Corrected path

// Styles are defined as JS objects for inline styling
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    backgroundColor: '#f9fafb',
    padding: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    width: '100%',
    maxWidth: '450px',
    boxSizing: 'border-box',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: '1rem',
    color: '#111827',
  },
  instruction: {
    color: '#6b7280',
    fontSize: '15px',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px',
    color: '#374151',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    backgroundColor: '#4f46e5',
    color: 'white',
    padding: '14px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  buttonDisabled: {
    backgroundColor: '#a5b4fc',
    cursor: 'not-allowed',
  },
  link: {
    display: 'block',
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#4f46e5',
    fontWeight: '500',
    textDecoration: 'none',
  },
  message: {
    textAlign: 'center',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
  },
  successMessage: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  errorMessage: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
};

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email address is required.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await requestPasswordReset({ email });
      setSuccess(response.message || 'OTP has been sent to your email.');

      // 3. ADD THIS: Redirect on success after a short delay
      setTimeout(() => {
        // Pass the email to the reset page so the user doesn't have to re-enter it
        navigate('/reset-password', { state: { email: email } });
      }, 2000); // 2-second delay to allow the user to read the message

    } catch (err) {
      setError(err.detail || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Forgot Your Password?</h2>
        <p style={styles.instruction}>
          No problem. Enter your email below and we will send you a link to reset it.
        </p>

        {success && (
          <p style={{ ...styles.message, ...styles.successMessage }}>{success}</p>
        )}
        {error && (
          <p style={{ ...styles.message, ...styles.errorMessage }}>{error}</p>
        )}

        {!success && (
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={styles.input}
                required
              />
            </div>
            <button
              type="submit"
              style={{ ...styles.button, ...(isLoading && styles.buttonDisabled) }}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <Link to="/login" style={styles.link}>
          &larr; Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
