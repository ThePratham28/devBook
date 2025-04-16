// src/components/EmailVerification.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const EmailVerification = () => {
    const { status } = useParams();
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Get the message from URL search params
        const urlParams = new URLSearchParams(window.location.search);
        const errorMsg = urlParams.get("message");

        if (status === "success") {
            setMessage(
                "Your email has been successfully verified! You can now log in."
            );
        } else if (status === "error") {
            setMessage(
                errorMsg ||
                    "There was an error verifying your email. Please try again."
            );
        }
    }, [status]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                {status === "success" ? (
                    <div
                        className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                        role="alert"
                    >
                        <strong className="font-bold">Success!</strong>
                        <span className="block sm:inline"> {message}</span>
                    </div>
                ) : (
                    <div
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                        role="alert"
                    >
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline"> {message}</span>
                    </div>
                )}

                <div>
                    {status === "success" ? (
                        <Link
                            to="/login"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Continue to Login
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Back to Login
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;
