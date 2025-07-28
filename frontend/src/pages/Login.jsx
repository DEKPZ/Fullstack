import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, User, Building2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { loginUser, fetchCurrentUser } from '../api'; // Import your API functions
import './Login.css';


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({}); // Clear previous errors

    try {
      // The LoginRequest schema expects 'email' and 'password'
      const loginData = {
        email: formData.email,
        password: formData.password,
      };

      const loginResponse = await loginUser(loginData);

      if (loginResponse.access_token) {
        // Token is saved in localStorage by the api.js function.
        // Now, fetch the user's details to get their role.
        const userDetails = await fetchCurrentUser();

        // Navigate based on the role from the /users/me endpoint
        switch (userDetails.role) {
          case 'employer':
            navigate('/employer');
            break;
          case 'student':
            navigate('/interns');
            break;
          case 'admin':
            navigate('/admin/dashboard');
            break;
          default:
            setErrors({ submit: 'Unknown user role. Please contact support.' });
        }
      } else {
        setErrors({ submit: 'Login failed. Please check your credentials.' });
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.status === 401) {
        setErrors({ submit: 'Invalid email or password. Please try again.' });
      } else {
        setErrors({ submit: 'Something went wrong. Please try again later.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const staggerContainer = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="login-container">
      <motion.div
        className="login-wrapper"
        initial="hidden"
        animate="show"
        variants={staggerContainer}
      >
        <motion.div className="login-card" variants={itemVariants}>
          <div className="login-header">
            <motion.div className="login-icon" variants={itemVariants}>
              <LogIn size={48} />
            </motion.div>
            <motion.h1 className="welcome-text" variants={itemVariants}>
              Welcome Back
            </motion.h1>
            <motion.h2 className="login-title" variants={itemVariants}>
              Login to Your Account
            </motion.h2>
          </div>

          <motion.form
            className="login-form"
            onSubmit={handleLogin}
            variants={itemVariants}
          >
            <div className="form-group">
              <label className="form-label">
                <Mail size={18} />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Lock size={18} />
                Password
              </label>
              <input
                type="password"
                name="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Login'}
            </Button>
          </motion.form>

          <motion.div className="login-divider" variants={itemVariants}>
            <span>OR</span>
          </motion.div>

          <motion.div className="login-links" variants={itemVariants}>
            <div className="registration-links">
              <h3 className="new-user-title">New to I-Intern?</h3>
              <div className="registration-buttons">
                <Link to="/register-student" className="registration-link student-link">
                  <User size={20} />
                  Register as Intern
                </Link>
                <Link to="/register-employer" className="registration-link employer-link">
                  <Building2 size={20} />
                  Register as Employer
                </Link>
              </div>
            </div>

            <div className="forgot-password-section">
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot your password?
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;