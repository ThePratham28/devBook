// src/components/Signup.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Form validation
        if (!name || !email || !password || !confirmPassword) {
            return setError("All fields are required");
        }

        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        if (password.length < 6) {
            return setError("Password must be at least 6 characters");
        }

        try {
            setLoading(true);
            const result = await signup(name, email, password);
            setSuccess(
                result.message ||
                    "Account created successfully! Check your email for verification."
            );

            // Don't navigate, let user check email
            // navigate('/login');
        } catch (err) {
            setError(err.message || "Failed to create an account");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{" "}
                        <Link
                            to="/login"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            sign in to your account
                        </Link>
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
                            <label htmlFor="name" className="sr-only">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
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
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                loading ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                        >
                            {loading ? "Signing up..." : "Sign up"}
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-50 text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <a
                            href="http://localhost:8080/api/auth/google"
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <svg
                                className="h-5 w-5 mr-2"
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                            >
                                <g transform="matrix(1, 0, 0, 1, 0, 0)">
                                    <path
                                        d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"
                                        fill="#4285F4"
                                    ></path>
                                </g>
                            </svg>
                            Sign up with Google
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
