const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../model/userModel");
const { uploadToCloudinary } = require("../helpers/cloudinaryHelper");
const { sendEmail } = require("../helpers/emailService");

const registerController = async (req, res) => {
    try {
        console.log("Role received in registerController:", req.body.role);
        const {name, email, password, role, fullName, phoneNumber, bio, location} = req.body;

        // Check if user already exists by email
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User with this email already exists"
            })
        }

        // Check if username (name field) already exists
        const existingUsername = await User.findOne({name});
        if(existingUsername){
            return res.status(400).json({
                success: false,
                message: "Username already taken"
            })
        }

        let profileImageUrl = null;
        if (req.file) {
            // Upload profile image to Cloudinary
            const result = await uploadToCloudinary(req.file.buffer);
            profileImageUrl = result.secure_url;
        }

        // Hash password and save user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name, // This is now the username
            email,
            password: hashedPassword,
            role,
            profileImage: profileImageUrl,
            fullName,
            phoneNumber,
            bio,
            location
        });
        await newUser.save();
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            profileImage: profileImageUrl
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
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                roles: user.roles || [user.role], // Support both role and roles array
                profileImage: user.profileImage
            }
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
        await sendEmail(email, 'Password Reset OTP', `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`);
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

// Logout Controller
const TokenBlacklist = require("../model/tokenBlacklistModel");

const logoutController = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: "Authorization header missing or invalid" });
        }
        const token = authHeader.split(' ')[1];

        // Add the token to blacklist with expiry
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.exp) {
            return res.status(400).json({ success: false, message: "Invalid token" });
        }
        const expiryDate = new Date(decoded.exp * 1000); // exp is in seconds

        const blacklistedToken = new TokenBlacklist({
            token,
            expiresAt: expiryDate
        });
        await blacklistedToken.save();

        // Clear the refresh token cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Logout failed",
            error: error.message
        });
    }
};

// Profile Upload Controller
const uploadProfileController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        const userId = req.user.userId; // Assuming authMiddleware sets req.user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Upload to Cloudinary
        const result = await uploadToCloudinary(req.file.buffer);

        // Update user profile image
        user.profileImage = result.secure_url;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile image uploaded successfully",
            profileImage: result.secure_url
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Profile upload failed",
            error: error.message
        });
    }
};

// Get User Profile Controller
const getUserProfileController = async (req, res) => {
    try {
        const userId = req.user.userId; // Assuming authMiddleware sets req.user
        const user = await User.findById(userId).select('-password -otp -otpExpiry');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User profile retrieved successfully",
            user: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve user profile",
            error: error.message
        });
    }
};

// Update User Profile Controller
const updateUserProfileController = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, fullName, phoneNumber, bio, location } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Update fields if provided
        if (name !== undefined) user.name = name; // Update name field (which is the username)
        if (fullName !== undefined) user.fullName = fullName;
        if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
        if (bio !== undefined) user.bio = bio;
        if (location !== undefined) user.location = location;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
                bio: user.bio,
                location: user.location,
                role: user.role,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update user profile",
            error: error.message
        });
    }
};

/**
 * Become Volunteer Controller
 * Updates the authenticated user's role to 'volunteer' and optionally stores
 * some additional volunteer preferences provided from the form.
 */
const becomeVolunteerController = async (req, res) => {
    try {
        const userId = req.user && req.user.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { name, fullName, area, skills } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Persist any optional fields coming from the volunteer form
        if (name !== undefined) user.name = name;
        if (fullName !== undefined) user.fullName = fullName;
        if (area !== undefined) user.location = area;
        if (skills !== undefined) user.bio = skills;

        // Flip the role
        user.role = 'volunteer';
        await user.save();

        return res.status(200).json({
            success: true,
            message: "You are now registered as a volunteer",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                fullName: user.fullName,
                location: user.location,
                bio: user.bio,
                role: user.role,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to register as volunteer",
            error: error.message
        });
    }
};

module.exports = {
    registerController,
    loginController,
    forgotPasswordController,
    verifyOtpController,
    resetPasswordController,
    logoutController,
    uploadProfileController,
    getUserProfileController,
    updateUserProfileController,
    becomeVolunteerController
};
