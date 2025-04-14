import nodemailer from "nodemailer";
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

export const passwordResetEmail = async (email, resetUrl) => {
    const mailOptions = {
        to: email,
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

    try {
        await transporter.sendMail(mailOptions);
        console.log("Password reset email sent successfully");
    } catch (error) {
        console.error("Error sending password reset email", error);
    }
};

export const verificationEmail = async (email, token) => {
    const verificationUrl = `${process.env.BASE_URL}/api/auth/verify-email/${token}`;

    const mailOptions = {
        from: {
            name: "Pratham Chopde",
            address: "prathamchopde31@gmail.com",
        },
        to: email,
        subject: "Verify Your Email Address",
        html: `
            <h1>Email Verification</h1>
            <p>Thank you for registering with us. Please click the link below to verify your email address:</p>
            <a href="${verificationUrl}">Verify Email</a>
            <p>If you did not create an account, please ignore this email.</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Verification email sent successfully");
        return true;
    } catch (error) {
        console.error("Error sending verification email", error);
        return false;
    }
};

export const welcomeEmail = async (email, name) => {
    const mailOptions = {
        from: {
            name: "Pratham Chopde",
            address: "prathamchopde31@gmail.com",
        },
        to: email,
        subject: "Welcome to Our Platform!",
        html: `
            <h1>Welcome, ${name}!</h1>
            <p>Thank you for verifying your email address.</p>
            <p>You can now enjoy all the features of our platform.</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Error sending welcome email:", error);
        return false;
    }
};
