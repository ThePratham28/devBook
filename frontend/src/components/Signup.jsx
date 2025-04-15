import React from "react";

export const Signup = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            
            <div className="w-[400px] bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            Create your account
                        </h1>
                        <p className="text-gray-500">
                            Sign up to get started with our platform
                        </p>
                    </div>

                    <form className="space-y-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 outline-none"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 outline-none"
                                placeholder="john@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 outline-none"
                                placeholder="••••••••"
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Must be at least 8 characters
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md font-medium hover:bg-primary-700 active:bg-primary-800 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Sign Up
                        </button>
                        {/* Next: "Add checkbox for terms and conditions" */}
                    </form>

                    <div className="mt-6 flex items-center">
                        <div className="flex-grow h-px bg-gray-300"></div>
                        <span className="mx-4 text-sm text-gray-500">OR</span>
                        <div className="flex-grow h-px bg-gray-300"></div>
                    </div>

                    <button className="mt-6 w-full flex items-center justify-center gap-3 border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-50 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 48 48"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill="#EA4335"
                                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                            />
                            <path
                                fill="#4285F4"
                                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                            />
                            <path
                                fill="#34A853"
                                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                            />
                            <path fill="none" d="M0 0h48v48H0z" />
                        </svg>
                        <span className="font-medium">
                            Continue with Google
                        </span>
                    </button>
                    {/* Next: "Add sign in with Apple button" */}

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Already have an account?
                        <a
                            href="https://webcrumbs.cloud/placeholder"
                            className="ml-1 font-medium text-primary-600 hover:text-primary-500 hover:underline transition-all duration-200"
                        >
                            Sign in
                        </a>
                    </p>
                    {/* Next: "Add forgot password link" */}
                </div>

                <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
                    <p className="text-xs text-center text-gray-500">
                        By signing up, you agree to our
                        <a
                            href="https://webcrumbs.cloud/placeholder"
                            className="text-primary-600 hover:text-primary-500 hover:underline transition-colors duration-200 mx-1"
                        >
                            Terms of Service
                        </a>
                        and
                        <a
                            href="https://webcrumbs.cloud/placeholder"
                            className="text-primary-600 hover:text-primary-500 hover:underline transition-colors duration-200 ml-1"
                        >
                            Privacy Policy
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};
