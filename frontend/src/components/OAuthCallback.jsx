// src/components/OAuthCallback.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import authService from "../services/authService";

const OAuthCallback = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    useEffect(() => {
        const getUser = async () => {
            try {
                // After OAuth redirect, we need to fetch the current user
                // since the JWT is set in cookies by backend
                const result = await authService.getCurrentUser();

                if (result && result.success) {
                    // Redirect to dashboard
                    navigate("/dashboard");
                } else {
                    setError("Authentication failed");
                    setTimeout(() => {
                        navigate("/login");
                    }, 3000);
                }
            } catch (err) {
                setError(
                    "Authentication failed: " + (err.message || "Unknown error")
                );
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, [navigate]);

    // If we already have a user in context, redirect to dashboard
    useEffect(() => {
        if (currentUser) {
            navigate("/dashboard");
        }
    }, [currentUser, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                {loading ? (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">
                            Completing authentication...
                        </h2>
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                    </div>
                ) : error ? (
                    <div
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                        role="alert"
                    >
                        <p className="font-bold">Authentication Error</p>
                        <p>{error}</p>
                        <p className="mt-4">Redirecting to login page...</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default OAuthCallback;
