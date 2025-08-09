import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { resetPassword } from '../api';

// Reusing similar styles from ForgotPassword for consistency
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
   link: {
    display: 'block',
    textAlign: 'center',
    marginTop: '1.5rem',
    color: '#4f46e5',
    fontWeight: '500',
    textDecoration: 'none',
  },
};


const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to access navigation state

  // Get email from state, initialize state for OTP and passwords
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Pre-fill the email from the location state when the component loads
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // If the user lands here directly, prompt them to start over
      setError("No email provided. Please start the password reset process again.");
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) { // Consistent with your backend
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Send email, otp, and new_password to the API
      const response = await resetPassword({
        email: email,
        otp: otp,
        new_password: newPassword,
      });
      setSuccess(response.message || 'Your password has been reset successfully!');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      const errorDetail = err.response?.data?.detail || 'An unknown error occurred.';
      if (errorDetail.includes("Invalid OTP")) {
          setError("The OTP you entered is incorrect. Please check and try again.");
      } else if (errorDetail.includes("expired")) {
          setError("The OTP has expired. Please request a new one.");
      } else {
          setError("Failed to reset password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Reset Your Password</h2>

        {success && (
          <div>
            <p style={{ ...styles.message, ...styles.successMessage }}>{success}</p>
            <p style={{ textAlign: 'center', color: '#6b7280' }}>Redirecting to login...</p>
          </div>
        )}
        {error && (
          <p style={{ ...styles.message, ...styles.errorMessage }}>{error}</p>
        )}

        {!success && (
          <form onSubmit={handleSubmit}>
            {/* New and updated form fields */}
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                style={{...styles.input, backgroundColor: '#e9ecef', cursor: 'not-allowed'}}
                readOnly // Make the email field read-only
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
            <div style={styles.formGroup}>
              <label htmlFor="newPassword" style={styles.label}>New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="confirmPassword" style={styles.label}>Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.input}
                required
              />
            </div>
            <button
              type="submit"
              style={{ ...styles.button, ...(isLoading && styles.buttonDisabled) }}
              disabled={isLoading || !email} // Disable if no email is present
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
         {error && (
            <Link to="/forgot-password" style={styles.link}>
             Request a new OTP
            </Link>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
