// src/pages/VerifyEmail.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyAndRegister, requestRegisterOTP } from '../api';

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
    marginBottom: '2rem',
    color: '#111827',
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

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      setError("No email provided. Please start the registration process again.");
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await verifyAndRegister({
        email: email,
        otp: otp,
      });
      setSuccess('Verification successful! Redirecting to dashboard...');
      setTimeout(() => {
        const userRole = location.state?.role;
        if (userRole === 'student') {
          window.location.href = '/interns';
        } else if (userRole === 'employer') {
          window.location.href = '/employer';
        } else {
          window.location.href = '/';
        }
      }, 2000);
    } catch (err) {
      setError('Invalid or expired OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendOtp = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      await requestRegisterOTP(location.state?.userData);
      setSuccess('A new OTP has been sent to your email.');
    } catch (err) {
      setError('Failed to resend OTP. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Verify Your Email</h2>

        {success && <p style={{ ...styles.message, ...styles.successMessage }}>{success}</p>}
        {error && <p style={{ ...styles.message, ...styles.errorMessage }}>{error}</p>}

        {!success && (
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                style={{...styles.input, backgroundColor: '#e9ecef', cursor: 'not-allowed'}}
                readOnly
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="otp" style={styles.label}>One-Time Password (OTP)</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={styles.input}
                placeholder="Enter the OTP from your email"
                required
              />
            </div>
            <button
              type="submit"
              style={{ ...styles.button, ...(isLoading && styles.buttonDisabled) }}
              disabled={isLoading || !email}
            >
              {isLoading ? 'Verifying...' : 'Verify and Register'}
            </button>
            <button
              type="button"
              onClick={handleResendOtp}
              style={{ ...styles.button, backgroundColor: '#6b7280', ...(isLoading && styles.buttonDisabled) }}
              disabled={isLoading}
            >
              Resend OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;