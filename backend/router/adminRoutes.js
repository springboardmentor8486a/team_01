const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/roleMiddleware');
const { getAdminStats, getAdminChartStats, getAdminCircleStats } = require('../controller/adminController');

// Admin-only route example
router.get('/welcome-admin', authenticateJWT, adminMiddleware, (req, res) => {
    res.json({ success: true, message: 'Welcome Admin!', user: req.user });
});

// New admin stats route
router.get('/stat', authenticateJWT, adminMiddleware, getAdminStats);

// New admin chart stats route
router.get('/chart/stat', authenticateJWT, adminMiddleware, getAdminChartStats);

// New admin circle stats route
router.get('/circle/stat', authenticateJWT, adminMiddleware, getAdminCircleStats);

module.exports = router;
