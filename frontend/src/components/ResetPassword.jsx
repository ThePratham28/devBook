// src/components/ResetPassword.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import authService from "../services/authService";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [validToken, setValidToken] = useState(false);
    const [tokenChecked, setTokenChecked] = useState(false);

    const { token } = useParams();
    const { resetPassword } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const validateToken = async () => {
            try {
                setLoading(true);
                const result = await authService.validateResetToken(token);
                if (result.success) {
                    setValidToken(true);
                } else {
                    setError("Invalid or expired token");
                }
            } catch (err) {
                setError("Invalid or expired token");
            } finally {
                setLoading(false);
                setTokenChecked(true);
            }
        };

        validateToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!newPassword || !confirmPassword) {
            return setError("All fields are required");
        }

        if (newPassword !== confirmPassword) {
            return setError("Passwords do not match");
        }

        if (newPassword.length < 6) {
            return setError("Password must be at least 6 characters");
        }

        try {
            setLoading(true);
            const result = await authService.resetPassword(token, newPassword);
            setSuccess(
                result.message || "Password has been reset successfully!"
            );

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (err) {
            setError(err.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    if (!tokenChecked) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full text-center">
                    <p>Validating reset token...</p>
                </div>
            </div>
        );
    }

    if (!validToken) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 text-center">
                    <div
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                        role="alert"
                    >
                        <span className="block sm:inline">
                            Invalid or expired reset token. Please request a new
                            password reset link.
                        </span>
                    </div>
                    <Link
                        to="/forgot-password"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Request new reset link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Reset your password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your new password below
                    </p>
                </div>

                {error && (
                    <div
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                        role="alert"
                    >
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {success && (
                    <div
                        className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                        role="alert"
                    >
                        <span className="block sm:inline">{success}</span>
                        <p className="mt-2">Redirecting to login page...</p>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="new-password" className="sr-only">
                                New Password
                            </label>
                            <input
                                id="new-password"
                                name="new-password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="confirm-password"
                                className="sr-only"
                            >
                                Confirm Password
                            </label>
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading || success}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                loading || success
                                    ? "opacity-70 cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
