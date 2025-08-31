// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
// Make sure to import loginUser API call
import { fetchCurrentUser, loginUser } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const verifyUser = useCallback(async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const user = await fetchCurrentUser();
                setCurrentUser(user);
            } catch (error) {
                console.error("Token verification failed", error);
                localStorage.removeItem('accessToken');
                setCurrentUser(null);
            }
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        verifyUser();
    }, [verifyUser]);

    // --- MODIFIED LOGIN FUNCTION ---
    const login = async (credentials) => {
        try {
            const loginResponse = await loginUser(credentials);
            if (loginResponse.access_token) {
                const userDetails = await fetchCurrentUser();
                setCurrentUser(userDetails); // State is set here
                return userDetails; // Return user details on success
            }
        } catch (error) {
            console.error("Login failed in context", error);
            logout(); // Ensure state is clean on failure
            throw error; // Re-throw the error to be caught in the component
        }
    };
    
    const logout = () => {
        localStorage.removeItem('accessToken');
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        login, // Use the new powerful login function
        logout,
        refetchUser: verifyUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};