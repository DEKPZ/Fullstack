// frontend/api.js

import axios from 'axios';

// Ensure this matches your FastAPI backend URL and port
const API_BASE_URL = 'http://localhost:8000';

// Helper to get auth token from localStorage (or wherever you store it)
const getAuthToken = () => {
  return localStorage.getItem('accessToken'); // Assuming you store it here after login
};

// --- Existing fetchUsers (from your original file) ---
export const fetchUsers = async () => {
  try {
    // Note: In the new backend, this might correspond to /admin/users and require an admin token.
    // Adjust this call based on your backend's actual user fetching endpoint and authorization.
    const token = getAuthToken();
    if (!token) throw new Error("No authentication token found.");
    const response = await axios.get(`${API_BASE_URL}/admin/users`, { // Assuming this is now an admin endpoint
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error.response ? error.response.data : error.message);
    throw error;
  }
};


// --- User & Auth API Calls ---

export const registerStudent = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register/student`, userData);
    return response.data;
  } catch (error) {
    console.error('Error registering student:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const registerEmployer = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register/employer`, userData);
    return response.data;
  } catch (error) {
    console.error('Error registering employer:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, credentials);
    // Store the token (e.g., in localStorage)
    localStorage.setItem('accessToken', response.data.access_token);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const fetchCurrentUser = async () => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No authentication token found.");
    const response = await axios.get(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// --- Internship API Calls ---

export const fetchInternships = async (searchQuery = '') => {
  try {
    const params = searchQuery ? { search_query: searchQuery } : {};
    const response = await axios.get(`${API_BASE_URL}/internships`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching internships:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const fetchInternshipDetail = async (internshipId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/internships/${internshipId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching internship ${internshipId} details:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

export const postInternship = async (internshipData) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No authentication token found.");
    const response = await axios.post(`${API_BASE_URL}/internships`, internshipData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error posting internship:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateInternship = async (internshipId, internshipData) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No authentication token found.");
    const response = await axios.put(`${API_BASE_URL}/internships/${internshipId}`, internshipData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating internship ${internshipId}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

export const deleteInternship = async (internshipId) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No authentication token found.");
    const response = await axios.delete(`${API_BASE_URL}/internships/${internshipId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting internship ${internshipId}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

export const fetchEmployerInternships = async () => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No authentication token found.");
    const response = await axios.get(`${API_BASE_URL}/employers/me/internships`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching employer internships:', error.response ? error.response.data : error.message);
    throw error;
  }
};


// --- Application API Calls ---

export const applyToInternship = async (internshipId, applicationData) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No authentication token found.");
    const response = await axios.post(`${API_BASE_URL}/internships/${internshipId}/apply`, applicationData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error applying to internship ${internshipId}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

export const fetchMyApplications = async () => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No authentication token found.");
    const response = await axios.get(`${API_BASE_URL}/students/me/applications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching my applications:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const fetchApplicantsForInternship = async (internshipId) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No authentication token found.");
    const response = await axios.get(`${API_BASE_URL}/internships/${internshipId}/applicants`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching applicants for internship ${internshipId}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateApplicationStatus = async (applicationId, newStatus) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No authentication token found.");
    const response = await axios.put(`${API_BASE_URL}/applications/${applicationId}/status?new_status=${newStatus}`, {}, { // Empty body as status is a query param
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating application ${applicationId} status:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

export const fetchHiredInterns = async () => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No authentication token found.");
    const response = await axios.get(`${API_BASE_URL}/hired-interns`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching hired interns:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// --- Profile API Calls ---

export const fetchMyStudentProfile = async () => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No authentication token found.");
    const response = await axios.get(`${API_BASE_URL}/students/me/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching student profile:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateMyStudentProfile = async (profileData) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No authentication token found.");
    const response = await axios.put(`${API_BASE_URL}/students/me/profile`, profileData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating student profile:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const fetchMyEmployerProfile = async () => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No authentication token found.");
    const response = await axios.get(`${API_BASE_URL}/employers/me/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching employer profile:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateMyEmployerProfile = async (profileData) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No authentication token found.");
    const response = await axios.put(`${API_BASE_URL}/employers/me/profile`, profileData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating employer profile:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const fetchApplicantProfile = async (userId) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No authentication token found.");
    const response = await axios.get(`${API_BASE_URL}/applicants/${userId}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching applicant profile for user ${userId}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

// --- Admin API Calls (requires admin token) ---

export const fetchAllUsers = async (role = '') => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No authentication token found.");
    const params = role ? { role: role } : {};
    const response = await axios.get(`${API_BASE_URL}/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: params
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all users (admin):', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No authentication token found.");
    const response = await axios.delete(`${API_BASE_URL}/admin/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${userId} (admin):`, error.response ? error.response.data : error.message);
    throw error;
  }
};

export const fetchAllInternshipsAdmin = async () => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No authentication token found.");
    const response = await axios.get(`${API_BASE_URL}/admin/internships`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all internships (admin):', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const deleteInternshipAdmin = async (internshipId) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No authentication token found.");
    const response = await axios.delete(`${API_BASE_URL}/admin/internships/${internshipId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting internship ${internshipId} (admin):`, error.response ? error.response.data : error.message);
    throw error;
  }
};

// --- NEWLY ADDED FUNCTION ---

export const fetchUserById = async (userId) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No authentication token found.");
    // This uses an admin endpoint. For production, you might want a specific
    // endpoint for employers to get basic applicant info.
    const response = await axios.get(`${API_BASE_URL}/admin/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

// src/api.js
// ... existing imports and functions

export const requestPasswordReset = async (emailData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/forgot-password`, emailData);
    return response.data;
  } catch (error) {
    console.error('Error requesting password reset:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const resetPassword = async (resetData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/reset-password`, resetData);
    return response.data;
  } catch (error) {
    console.error('Error resetting password:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const requestRegisterOTP = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/request-register-otp`, userData);
    return response.data;
  } catch (error) {
    console.error('Error requesting register OTP:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const verifyAndRegister = async (verificationData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verify-and-register`, verificationData);
    localStorage.setItem('accessToken', response.data.access_token);
    return response.data;
  } catch (error) {
    console.error('Error verifying and registering:', error.response ? error.response.data : error.message);
    throw error;
  }
};