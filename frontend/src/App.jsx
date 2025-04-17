import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Dashboard from "./components/dashboard";
import CreateBookmark from "./components/CreateBookmark";
import EditBookmark from "./components/EditBookmark";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import OAuthCallback from "./components/OAuthCallback";

function App() {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-gray-100">
                <Routes>
                    {/* Authentication Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />

                    <Route
                        path="/reset-password/:token"
                        element={<ResetPassword />}
                    />
                    <Route path="/auth/callback" element={<OAuthCallback />} />

                    {/* Dashboard and Bookmark Management */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route
                        path="/create-bookmark"
                        element={<CreateBookmark />}
                    />
                    <Route
                        path="/edit-bookmark/:id"
                        element={<EditBookmark />}
                    />

                    {/* Default Route */}
                    <Route path="/" element={<Login />} />
                </Routes>
            </div>
        </AuthProvider>
    );
}

export default App;
