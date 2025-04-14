import express from "express";
const router = express.Router();
import jwt from "jsonwebtoken";

import {
    signup,
    login,
    logout,
    forgotPassword,
    resetForm,
    resetPassword,
    verifyEmail,
    resendVerificationEmail,
} from "../controllers/auth.controller.js";
import passport from "passport";

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/forgot-password", forgotPassword);

// for user redirection (password reset)
router.get("/reset-password/:token", resetForm);

// submit new password
router.post("/reset/:token", resetPassword);

// Verify email
router.get("/verify-email/:token", verifyEmail);
router.post("/verify-email/:token", resendVerificationEmail);

// Google OAuth routes
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        const user = req.user;

        const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        res.cookie("token", jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.redirect("/");
    }
);
export default router;
