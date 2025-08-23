import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { User, Mail, Lock, MapPin, GraduationCap, Calendar, Phone, Globe } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { requestRegisterOTP } from '../api'; // Corrected: Only one import is needed
import './RegisterStudent.css';

const RegisterStudent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    mobileNumber: '',
    universityName: '',
    pincode: '',
    country: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, mobileNumber: value });
    if (errors.mobileNumber) {
      setErrors({ ...errors, mobileNumber: '' });
    }
  };


  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.mobileNumber) newErrors.mobileNumber = 'Mobile number is required';
    if (!formData.universityName.trim()) newErrors.universityName = 'University name is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long.';
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = 'Password must contain an uppercase letter.';
      } else if (!/[a-z]/.test(formData.password)) {
        newErrors.password = 'Password must contain a lowercase letter.';
      } else if (!/[0-9]/.test(formData.password)) {
        newErrors.password = 'Password must contain a number.';
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
        newErrors.password = 'Password must contain a special character.';
      }
    }
    
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({}); // Clear previous errors

    try {
      // Map frontend state to the format expected by the backend UserCreate schema
      const userData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone_number: formData.mobileNumber,
        address: `${formData.pincode}, ${formData.country}`, // Combining for simplicity
        role: 'student'
      };

      await requestRegisterOTP(userData);

      // On success, show a message and redirect to the verification page
      alert('Registration successful! Please check your email for an OTP to verify your account.');
      navigate('/verify-email', { state: { email: formData.email, role: 'student', userData: userData } });

    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data?.detail.includes("already registered")) {
        setErrors({ submit: 'This email is already registered. Please login.' });
      } else {
        setErrors({ submit: 'Registration failed. Please try again later.' });
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
    <div className="register-student-container">
      <motion.div
        className="register-student-wrapper"
        initial="hidden"
        animate="show"
        variants={staggerContainer}
      >
        <motion.div className="register-student-card" variants={itemVariants}>
          <div className="register-student-header">
            <motion.div className="register-student-icon" variants={itemVariants}>
              <GraduationCap size={48} />
            </motion.div>
            <motion.h1 className="register-student-title" variants={itemVariants}>
              Join as an Intern
            </motion.h1>
            <motion.p className="register-student-subtitle" variants={itemVariants}>
              Start your career journey with I-Intern
            </motion.p>
          </div>

          <motion.form
            className="register-student-form"
            onSubmit={handleSubmit}
            variants={itemVariants}
          >
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <User size={18} />
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  className={`form-input ${errors.firstName ? 'error' : ''}`}
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <User size={18} />
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  className={`form-input ${errors.lastName ? 'error' : ''}`}
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Calendar size={18} />
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                className={`form-input ${errors.dateOfBirth ? 'error' : ''}`}
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
              {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Phone size={18} />
                Mobile Number
              </label>
              <div className={`phone-input-wrapper ${errors.mobileNumber ? 'error' : ''}`}>
                <PhoneInput
                  country={'in'}
                  value={formData.mobileNumber}
                  onChange={handlePhoneChange}
                  inputProps={{
                    name: 'mobileNumber',
                    required: true,
                  }}
                  containerClass="phone-input-container"
                  inputClass="phone-input"
                  buttonClass="phone-button"
                />
              </div>
              {errors.mobileNumber && <span className="error-message">{errors.mobileNumber}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <GraduationCap size={18} />
                University Name
              </label>
              <input
                type="text"
                name="universityName"
                className={`form-input ${errors.universityName ? 'error' : ''}`}
                placeholder="Enter your university name"
                value={formData.universityName}
                onChange={handleChange}
              />
              {errors.universityName && <span className="error-message">{errors.universityName}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <MapPin size={18} />
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  className={`form-input ${errors.pincode ? 'error' : ''}`}
                  placeholder="Enter pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                />
                {errors.pincode && <span className="error-message">{errors.pincode}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Globe size={18} />
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  className={`form-input ${errors.country ? 'error' : ''}`}
                  placeholder="Enter country"
                  value={formData.country}
                  onChange={handleChange}
                />
                {errors.country && <span className="error-message">{errors.country}</span>}
              </div>
            </div>

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

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <Lock size={18} />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Lock size={18} />
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>
            </div>

            {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="register-student-button"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Register as Intern'}
            </Button>

            <div className="register-student-footer">
              <p>Already have an account? <button type="button" onClick={() => navigate('/login')} className="link-button">Login here</button></p>
            </div>
          </motion.form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterStudent;