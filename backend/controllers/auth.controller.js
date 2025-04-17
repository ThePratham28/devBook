import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { Op } from "sequelize";
import { verificationEmail, welcomeEmail } from "../services/email.service.js";

import models from "../models/model.js";
const { User } = models;

export const signup = async (req, res, next) => {
    const { email, password, name } = req.body;

    try {
        if (!email || !password || !name) {
            const error = new Error("Email and password are required");
            error.statusCode = 400;
            throw error;
        }

        const userAlreadyExists = await User.findOne({ where: { email } });
        if (userAlreadyExists) {
            const error = new Error("User already exists");
            error.statusCode = 400;
            throw error;
        }

        const verificationToken = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const user = await User.create({
            email,
            password,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 1 day
        });

        await verificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message:
                "Account created successfully! Please check your email to verify your account.",
            userId: user.id,
        });
    } catch (error) {
        next(error);
    }
};

export const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            where: {
                verificationToken: token,
                verificationTokenExpiresAt: { [Op.gt]: Date.now() },
            },
        });

        if (!user) {
            const error = new Error("Invalid or expired verification token");
            error.statusCode = 400;
            throw error;
        }

        user.isVerified = true;
        user.verificationToken = null;
        user.verificationTokenExpiresAt = null;
        await user.save();

        await welcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "Email verified successfully, you can now login",
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            const error = new Error("Invalid Credentials");
            error.statusCode = 400;
            throw error;
        }

        if (!user.isVerified && !user.googleId) {
            const error = new Error(
                "Please verify your email address before logging in."
            );
            error.statusCode = 400;
            throw error;
        }

        const isPasswordValid = await user.isValidPassword(password);

        if (!isPasswordValid) {
            const error = new Error("Invalid Credentials");
            error.statusCode = 400;
            throw error;
        }

        const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.cookie("token", jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        user.lastLogin = Date.now();
        await user.save();

        const userData = user.toJSON();
        delete userData.password;

        res.status(200).json({
            success: true,
            message: "User LoggedIn successfully!!",
            user: {
                id: userData.id,
                name: userData.name,
                email: userData.email,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const resendVerificationEmail = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        if (user.isVerified) {
            const error = new Error("User is already verified");
            error.statusCode = 400;
            throw error;
        }

        const verificationToken = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        user.verificationToken = verificationToken;
        user.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 1 day

        await user.save();
        await verificationEmail(user.email, verificationToken);

        res.status(200).json({
            success: true,
            message:
                "Verification email resent successfully! Please check your email.",
        });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: "Logged out Successfully!!!",
    });
};

export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            to: user.email,
            from: {
                name: "Pratham Chopde",
                address: "prathamchopde31@gmail.com",
            },
            subject: "Password Reset",
            text: `You requested a password reset. Please click the following link to reset your password: \n\n ${resetUrl}`,
            html: `
            <h1>Password Reset</h1>
            <p>You requested a password reset. Please click the following link to reset your password:</p>
            <a href="${resetUrl}">Reset Password</a>
            <p>If you did not request this, please ignore this email.</p>
            <p>Thank you!</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({
            success: true,
            message: "Password reset email sent",
        });
    } catch (error) {
        next(error);
    }
};

export const resetForm = async (req, res, next) => {
    const { token } = req.params;

    try {
        const user = await User.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpiresAt: { [Op.gt]: Date.now() },
            },
        });

        if (!user) {
            const error = new Error("Invalid or expired reset token");
            error.statusCode = 400;
            throw error;
        }

        res.status(200).json({
            success: true,
            message: "Valid reset token",
        });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const user = await User.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpiresAt: { [Op.gt]: Date.now() },
            },
        });

        if (!user) {
            const error = new Error("Token is invalid or expired");
            error.statusCode = 400;
            throw error;
        }

        if (!newPassword) {
            const error = new Error("New password is required");
            error.statusCode = 400;
            throw error;
        }

        user.password = newPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpiresAt = null;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password has been updated",
        });
    } catch (error) {
        next(error);
    }
};
