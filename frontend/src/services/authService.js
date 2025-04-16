// src/services/authService.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

// Configure axios to send cookies with requests
axios.defaults.withCredentials = true;

const authService = {
    // Sign up a new user
    signup: async (name, email, password) => {
        try {
            const response = await axios.post(`${API_URL}/signup`, {
                name,
                email,
                password,
            });
            return response.data;
        } catch (error) {
            throw (
                error.response?.data || {
                    message: "Error connecting to server",
                }
            );
        }
    },

    // Login user
    login: async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, {
                email,
                password,
            });
            return response.data;
        } catch (error) {
            throw (
                error.response?.data || {
                    message: "Error connecting to server",
                }
            );
        }
    },

    // Logout user
    logout: async () => {
        try {
            const response = await axios.post(`${API_URL}/logout`);
            return response.data;
        } catch (error) {
            throw (
                error.response?.data || {
                    message: "Error connecting to server",
                }
            );
        }
    },

    // Get current user
    getCurrentUser: async () => {
        try {
            const response = await axios.get(`${API_URL}/me`);
            return response.data;
        } catch (error) {
            // Don't throw on 401 - just return null
            if (error.response?.status === 401) {
                return null;
            }
            throw (
                error.response?.data || {
                    message: "Error connecting to server",
                }
            );
        }
    },

    // Resend verification email
    resendVerification: async (email) => {
        try {
            const response = await axios.post(
                `${API_URL}/verify-email/resend`,
                { email }
            );
            return response.data;
        } catch (error) {
            throw (
                error.response?.data || {
                    message: "Error connecting to server",
                }
            );
        }
    },

    // Forgot password
    forgotPassword: async (email) => {
        try {
            const response = await axios.post(`${API_URL}/forgot-password`, {
                email,
            });
            return response.data;
        } catch (error) {
            throw (
                error.response?.data || {
                    message: "Error connecting to server",
                }
            );
        }
    },

    // Reset password
    resetPassword: async (token, newPassword) => {
        try {
            const response = await axios.post(`${API_URL}/reset/${token}`, {
                newPassword,
            });
            return response.data;
        } catch (error) {
            throw (
                error.response?.data || {
                    message: "Error connecting to server",
                }
            );
        }
    },

    // Validate reset token
    validateResetToken: async (token) => {
        try {
            const response = await axios.get(
                `${API_URL}/reset-password/${token}`,
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );
            return response.data;
        } catch (error) {
            throw (
                error.response?.data || {
                    message: "Error connecting to server",
                }
            );
        }
    },
};

export default authService;
