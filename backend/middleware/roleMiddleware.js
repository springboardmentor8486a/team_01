// Middleware to check if user is admin
function adminMiddleware(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ success: false, message: 'Admin access only' });
}

// Middleware to check if user is volunteer
function volunteerMiddleware(req, res, next) {
    if (req.user && req.user.role === 'volunteer') {
        return next();
    }
    return res.status(403).json({ success: false, message: 'Volunteer access only' });
}

module.exports = { adminMiddleware, volunteerMiddleware };
