import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Building2, User, Mail, Lock, MapPin, Globe, Phone, Briefcase, Link as LinkIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { registerEmployer } from '../api'; // Import your API function
import './RegisterEmployer.css';

const RegisterEmployer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    contactNumber: '',
    companyWebsite: '',
    industryType: '',
    address: '',
    country: '',
    state: '',
    city: '',
    pincode: '',
    password: '',
    confirmPassword: '',
    role: 'employer',
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
    setFormData({ ...formData, contactNumber: value });
    if (errors.contactNumber) {
      setErrors({ ...errors, contactNumber: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.contactNumber) newErrors.contactNumber = 'Contact number is required';
    if (!formData.industryType) newErrors.industryType = 'Industry type is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    if (!formData.password) newErrors.password = 'Password is required';
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

    if (formData.companyWebsite && !formData.companyWebsite.startsWith('http')) {
      newErrors.companyWebsite = 'Website URL must start with http:// or https://';
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
    setErrors({});

    try {
        const nameParts = formData.contactPerson.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');

      const userData = {
        first_name: firstName,
        last_name: lastName || '',
        email: formData.email,
        password: formData.password,
        phone_number: formData.contactNumber,
        address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.country} - ${formData.pincode}`,
        role: 'employer',
      };

      await registerEmployer(userData);

      alert('Employer registration successful! Please log in.');
      navigate('/login');

    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data?.detail?.includes("already registered")) {
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

  const industryOptions = [
      'IT & Software', 'Marketing & Advertising', 'Finance & Banking', 'Healthcare & Medical',
      'Education & Training', 'Manufacturing', 'Retail & E-commerce', 'Consulting',
      'Media & Entertainment', 'Real Estate', 'Automotive', 'Food & Beverage', 'Others'
  ];

  return (
    <div className="register-employer-container">
      <motion.div
        className="register-employer-wrapper"
        initial="hidden"
        animate="show"
        variants={staggerContainer}
      >
        <motion.div className="register-employer-card" variants={itemVariants}>
          <div className="register-employer-header">
            <motion.div className="register-employer-icon" variants={itemVariants}>
              <Building2 size={48} />
            </motion.div>
            <motion.h1 className="register-employer-title" variants={itemVariants}>
              Join as an Employer
            </motion.h1>
            <motion.p className="register-employer-subtitle" variants={itemVariants}>
              Find talented interns for your organization
            </motion.p>
          </div>

          <motion.form
            className="register-employer-form"
            onSubmit={handleSubmit}
            variants={itemVariants}
          >
            {/* Company Information */}
            <div className="form-section">
              <h3 className="section-title">Company Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <Building2 size={18} />
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    className={`form-input ${errors.companyName ? 'error' : ''}`}
                    placeholder="Enter company name"
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                  {errors.companyName && <span className="error-message">{errors.companyName}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <User size={18} />
                    Contact Person
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    className={`form-input ${errors.contactPerson ? 'error' : ''}`}
                    placeholder="Enter contact person name"
                    value={formData.contactPerson}
                    onChange={handleChange}
                  />
                  {errors.contactPerson && <span className="error-message">{errors.contactPerson}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <Mail size={18} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="Enter company email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Phone size={18} />
                    Contact Number
                  </label>
                  <div className={`phone-input-wrapper ${errors.contactNumber ? 'error' : ''}`}>
                    <PhoneInput
                      country={'ae'}
                      value={formData.contactNumber}
                      onChange={handlePhoneChange}
                      containerClass="phone-input-container"
                      inputClass="phone-input"
                      buttonClass="phone-button"
                    />
                  </div>
                  {errors.contactNumber && <span className="error-message">{errors.contactNumber}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <LinkIcon size={18} />
                    Company Website (Optional)
                  </label>
                  <input
                    type="url"
                    name="companyWebsite"
                    className={`form-input ${errors.companyWebsite ? 'error' : ''}`}
                    placeholder="https://www.example.com"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                  />
                  {errors.companyWebsite && <span className="error-message">{errors.companyWebsite}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <Briefcase size={18} />
                    Industry Type
                  </label>
                  <select
                    name="industryType"
                    className={`form-select ${errors.industryType ? 'error' : ''}`}
                    value={formData.industryType}
                    onChange={handleChange}
                  >
                    <option value="">Select Industry</option>
                    {industryOptions.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                  {errors.industryType && <span className="error-message">{errors.industryType}</span>}
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="form-section">
              <h3 className="section-title">Address Information</h3>
              <div className="form-group">
                <label className="form-label">
                  <MapPin size={18} />
                  Company Address
                </label>
                <input
                  type="text"
                  name="address"
                  className={`form-input ${errors.address ? 'error' : ''}`}
                  placeholder="Enter complete address"
                  value={formData.address}
                  onChange={handleChange}
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>
              <div className="form-row">
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
                <div className="form-group">
                  <label className="form-label">
                    <MapPin size={18} />
                    State/Province
                  </label>
                  <input
                    type="text"
                    name="state"
                    className={`form-input ${errors.state ? 'error' : ''}`}
                    placeholder="Enter state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                  {errors.state && <span className="error-message">{errors.state}</span>}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <MapPin size={18} />
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    className={`form-input ${errors.city ? 'error' : ''}`}
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>
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
              </div>
            </div>

            {/* Security Information */}
            <div className="form-section">
              <h3 className="section-title">Security Information</h3>
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
            </div>

            {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="register-employer-button"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Register as Employer'}
            </Button>

            <div className="register-employer-footer">
              <p>Already have an account? <button type="button" onClick={() => navigate('/login')} className="link-button">Login here</button></p>
            </div>
          </motion.form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterEmployer;