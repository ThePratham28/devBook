// src/components/ForgotPassword.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const { forgotPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!email) {
            return setError("Email is required");
        }

        try {
            setLoading(true);
            const result = await forgotPassword(email);
            setSuccess(
                result.message || "Password reset email sent! Check your inbox."
            );
        } catch (err) {
            setError(err.message || "Failed to send reset email");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Reset your password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your email address and we'll send you a link to
                        reset your password.
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
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                loading ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                        >
                            {loading ? "Sending..." : "Send reset link"}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <Link
                        to="/login"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
