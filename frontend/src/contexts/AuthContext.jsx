// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                setLoading(true);
                const result = await authService.getCurrentUser();
                if (result && result.success) {
                    setCurrentUser(result.user);
                }
            } catch (err) {
                console.error("Error checking authentication:", err);
            } finally {
                setLoading(false);
            }
        };

        checkLoggedIn();
    }, []);

    const signup = async (name, email, password) => {
        setLoading(true);
        setError(null);
        try {
            const result = await authService.signup(name, email, password);
            return result;
        } catch (err) {
            setError(err.message || "An error occurred during signup");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const result = await authService.login(email, password);
            if (result.success) {
                setCurrentUser(result.user);
            }
            return result;
        } catch (err) {
            setError(err.message || "Invalid credentials");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        setError(null);
        try {
            await authService.logout();
            setCurrentUser(null);
        } catch (err) {
            setError(err.message || "Error during logout");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const forgotPassword = async (email) => {
        setLoading(true);
        setError(null);
        try {
            return await authService.forgotPassword(email);
        } catch (err) {
            setError(err.message || "Error sending reset email");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (token, newPassword) => {
        setLoading(true);
        setError(null);
        try {
            return await authService.resetPassword(token, newPassword);
        } catch (err) {
            setError(err.message || "Error resetting password");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        currentUser,
        loading,
        error,
        signup,
        login,
        logout,
        forgotPassword,
        resetPassword,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
