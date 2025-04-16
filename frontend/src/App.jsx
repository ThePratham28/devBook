// src/App.jsx
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import EmailVerification from "./components/EmailVerification";
import OAuthCallback from "./components/OAuthCallback";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/dashboard";
import CreateBookmark from "./components/CreateBookmark";
import EditBookmark from "./components/EditBookmark";

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />
                    <Route
                        path="/reset-password/:token"
                        element={<ResetPassword />}
                    />
                    <Route
                        path="/verify-email/:status"
                        element={<EmailVerification />}
                    />
                    <Route path="/auth/callback" element={<OAuthCallback />} />

                    {/* Protected Routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/create-bookmark"
                        element={
                            <ProtectedRoute>
                                <CreateBookmark />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/edit-bookmark"
                        element={
                            <ProtectedRoute>
                                <EditBookmark />
                            </ProtectedRoute>
                        }
                    />

                    {/* Redirects */}
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
