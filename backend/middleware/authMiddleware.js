const jwt = require("jsonwebtoken");

// JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
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
