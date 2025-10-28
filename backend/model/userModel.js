const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ["user", "admin", "volunteer"],
        default: "user"
    },
    roles: {
        type: [String],
        enum: ["user", "admin", "volunteer"],
        default: ["user"]
    },
    preferredArea: {
        type: String,
        trim: true
    },
    skills: {
        type: String,
        trim: true
    },
    otp: {
        type: String,
        trim: true,
        default: null
    },
    otpExpiry: {
        type: Date,
        default: null
    },
    profileImage: {
        type: String,
        default: null
    },
    // Additional fields for profile
    fullName: {
        type: String,
        trim: true,
        default: null
    },
    phoneNumber: {
        type: String,
        trim: true,
        default: null
    },
    bio: {
        type: String,
        trim: true,
        default: null
    },
    location: {
        type: String,
        trim: true,
        default: null
    }
}, {
    timestamps: true
});

const model = mongoose.model("User", userSchema);
module.exports = model;
