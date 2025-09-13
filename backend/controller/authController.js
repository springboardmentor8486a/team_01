const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const User = require("../model/userModel");
const registerController = async (req, res) => {
    try {
        const {name, email, password, role} = req.body;
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                success: false,
                message: "user already exists"
            })
        }
        // Hash password and save user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();
        return res.status(201).json({
            success: true,
            message: "User registered successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Registration failed",
            error: error.message
        });
    }
};

// Login Controller
const loginController = async (req, res) => {
    try {
        const { email, password, role} = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "invalid Email"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Password"
            });
        }
        // Update user role if provided
        if (role) {
            user.role = role;
            await user.save();
        }
        // Generate tokens
        const accessToken = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );
        // Set refresh token in HttpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        return res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message
        });
    }
};

console.log("EMAIL_SERVICE:", process.env.EMAIL_SERVICE);
console.log("EMAIL_USER:", process.env.EMAIL_USER ? "Loaded" : "Not Loaded");
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Not Loaded");

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // App password
    }
});

// Forgot Password Controller
const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        // Set expiry to 10 minutes from now
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();
        // Send OTP via email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`
        };
        await transporter.sendMail(mailOptions);
        return res.status(200).json({
            success: true,
            message: "OTP sent to your email"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to send OTP",
            error: error.message
        });
    }
};

// Verify OTP Controller
const verifyOtpController = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP"
            });
        }
        return res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "OTP verification failed",
            error: error.message
        });
    }
};

// Reset Password Controller
const resetPasswordController = async (req, res) => {
    try {
        const { email, otp, newpassword } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP"
            });
        }
        // Hash new password
        const hashedPassword = await bcrypt.hash(newpassword, 10);
        user.password = hashedPassword;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Password reset failed",
            error: error.message
        });
    }
};

module.exports = {
    registerController,
    loginController,
    forgotPasswordController,
    verifyOtpController,
    resetPasswordController
};
