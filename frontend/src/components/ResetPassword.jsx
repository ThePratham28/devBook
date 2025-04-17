// src/components/ResetPassword.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
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
    // const { resetPassword } = useAuth();
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
                            Reset password
                        </h2>
                        <p className="mt-3 text-gray-600">
                            Enter your new password below
                        </p>
                    </div>

                    {error && (
                        <div
                            className="mt-6 flex items-center p-4 bg-red-50 border-l-4 border-red-500 rounded-md"
                            role="alert"
                        >
                            <svg
                                className="h-5 w-5 text-red-500 mr-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                            <span className="text-sm text-red-700">
                                {error}
                            </span>
                        </div>
                    )}

                    {success && (
                        <div
                            className="mt-6 flex items-center p-4 bg-green-50 border-l-4 border-green-500 rounded-md"
                            role="alert"
                        >
                            <svg
                                className="h-5 w-5 text-green-500 mr-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            <div>
                                <span className="text-sm text-green-700">
                                    {success}
                                </span>
                                <p className="text-sm text-green-700 mt-1">
                                    Redirecting to login page...
                                </p>
                            </div>
                        </div>
                    )}

                    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label
                                htmlFor="new-password"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                New Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    id="new-password"
                                    name="new-password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 text-gray-900"
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="confirm-password"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="h-5 w-5 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    id="confirm-password"
                                    name="confirm-password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 text-gray-900"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading || success}
                                className={`w-full py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ${
                                    loading || success
                                        ? "opacity-70 cursor-not-allowed"
                                        : ""
                                }`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Resetting...
                                    </span>
                                ) : (
                                    "Reset Password"
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8">
                        <p className="text-center text-sm text-gray-600">
                            Remember your password?{" "}
                            <Link
                                to="/login"
                                className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150"
                            >
                                Back to login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
