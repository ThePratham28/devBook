import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { Op } from "sequelize";
import { verificationEmail, welcomeEmail } from "../services/email.service.js";

export const signup = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        if (!email || !password || !name) {
            logger.warn("Signup failed: Missing email or password");
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }
        const userAlreadyExists = await User.findOne({ where: { email } });
        if (userAlreadyExists) {
            return res
                .status(400)
                .json({ success: false, message: "User already exists" });
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

        // send verification email
        await verificationEmail(user.email, verificationToken);

        // // generate Token and set Cookie
        // const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        //     expiresIn: "7d",
        // });

        // res.cookie("token", jwtToken, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production",
        //     sameSite: "strict",
        //     maxAge: 7 * 24 * 60 * 60 * 1000,
        // });

        // const userData = user.toJSON();
        // delete userData.password;
        // delete userData.verificationToken;
        // delete userData.verificationTokenExpiresAt;

        res.status(201).json({
            success: true,
            message:
                "Account created successfully! Please check your email to verify your account.",
            userId: user.id,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating user",
            error: error.message,
        });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            where: {
                verificationToken: token,
                verificationTokenExpiresAt: { [Op.gt]: Date.now() },
            },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification token",
            });
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
        res.status(500).json({
            success: false,
            message: "Error verifying email",
            error: error.message,
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid Credentials" });
        }

        if (!user.isVerified && !user.googleId) {
            return res.status(400).json({
                success: false,
                message: "Please verify your email address before logging in.",
            });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid Credentials" });
        }

        const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.cookie("token", jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, // 1 days
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
        console.error("Unable to login ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const resendVerificationEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "User is already verified",
            });
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
        console.error("Unable to resend verification email ", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const logout = async (req, res) => {
    res.clearCookie("token");
    // res.clearCookie("jwtoken");
    res.status(200).json({
        success: true,
        message: "Logged out Successfully!!!",
    });
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        // create the reset URL
        const resetUrl = `${process.env.BASE_URL}/api/auth/reset-password/${resetToken}`;

        // send email
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
        console.error("Unable to forgot password ", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const resetForm = async (req, res) => {
    const { token } = req.params;

    try {
        const user = await User.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpiresAt: { [Op.gt]: Date.now() },
            },
        });

        if (!user) {
            return res.status(400).send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Invalid Token</title>
                </head>
                <body>
                    <h1>Invalid or Expired Token</h1>
                    <p>The password reset token is invalid or has expired. Please request a new password reset.</p>
                </body>
                </html>
            `);
        }

        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Password</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    flex-direction: column;
                }
                .container {
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    width: 100%;
                    max-width: 400px;
                    text-align: center;
                }
                h1 {
                    color: #333;
                    margin-bottom: 20px;
                }
                label {
                    font-size: 16px;
                    color: #555;
                    display: block;
                    margin-bottom: 8px;
                    text-align: left;
                }
                input[type="password"] {
                    width: 100%;
                    padding: 10px;
                    margin-bottom: 20px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 16px;
                }
                button {
                    background-color: #007bff;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    font-size: 16px;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #0056b3;
                }
            </style>
        </head>
        <body>
            <h1>Reset your Password</h1>
            <form action="http://localhost:8080/api/auth/reset/${token}" method="POST">
                <label for="newPassword">New Password:</label>
                <input type="password" id="newPassword" name="newPassword" required>
                <button type="submit">Reset Password</button>
            </form>
        </body>
        </html>
    `);
    } catch (error) {
        console.error("Error rendering reset password form:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const user = await User.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpiresAt: { [Op.gt]: Date.now() }, // Use Sequelize Op
            },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Token is invalid or expired",
            });
        }

        const hashedPassword = await bcryptjs.hash(newPassword, 10);
        user.password = hashedPassword; // Hash the password before saving
        user.resetPasswordToken = null;
        user.resetPasswordExpiresAt = null;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password has been updated",
        });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
