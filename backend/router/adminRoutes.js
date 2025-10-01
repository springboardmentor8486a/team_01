const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/roleMiddleware');
const { getAdminStats } = require('../controller/adminController');

// Admin-only route example
router.get('/welcome-admin', authenticateJWT, adminMiddleware, (req, res) => {
    res.json({ success: true, message: 'Welcome Admin!', user: req.user });
});

// New admin stats route
router.get('/stat', authenticateJWT, adminMiddleware, getAdminStats);

module.exports = router;
