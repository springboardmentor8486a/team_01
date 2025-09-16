const jwt = require("jsonwebtoken");
const TokenBlacklist = require("../model/tokenBlacklistModel");

// JWT Authentication Middleware
const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];

        // Check if token is blacklisted
        const blacklisted = await TokenBlacklist.findOne({ token });
        if (blacklisted) {
            return res.status(403).json({ success: false, message: "Token is blacklisted. Please login again." });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ success: false, message: "Invalid or expired token" });
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({ success: false, message: "Authorization header missing" });
    }
};

module.exports = authenticateJWT;
