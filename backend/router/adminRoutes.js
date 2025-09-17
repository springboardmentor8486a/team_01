const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/roleMiddleware');

// Admin-only route example
router.get('/welcome-admin', authenticateJWT, adminMiddleware, (req, res) => {
    res.json({ success: true, message: 'Welcome Admin!', user: req.user });
});

module.exports = router;
