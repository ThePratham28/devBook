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
import { authenticate } from "../middlewares/auth.middleware.js";

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", authenticate, logout);

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

        res.redirect(`${process.env.CLIENT_URL}/auth/callback`);
    }
);


router.get("/me", authenticate,(req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json({
        success: true,
        user: {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
        },
    });
});
export default router;
