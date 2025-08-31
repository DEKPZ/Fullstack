// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from 'react-bootstrap';

const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, isLoading, currentUser } = useAuth();

    if (isLoading) {
        // Show a full-page loader while checking auth status
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spinner animation="border" />
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    // Optional: Role-based access control
    if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
        // Redirect if the user's role is not allowed
        return <Navigate to="/" replace />; // Or to an "unauthorized" page
    }

    return <Outlet />; // Render the child route (the protected page)
};

export default ProtectedRoute;