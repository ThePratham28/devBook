import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Signup } from "./components/Signup";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import ResetPasswd from "./components/ResetPasswd";
import Dashboard from "./components/dashboard";
import CreateBookmark from "./components/CreateBookmark";
import EditBookmark from "./components/EditBookmark";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                    path="/reset-password/:token"
                    element={<ResetPasswd />}
                />
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
                    path="/edit-bookmark/:id"
                    element={
                        <ProtectedRoute>
                            <EditBookmark />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
