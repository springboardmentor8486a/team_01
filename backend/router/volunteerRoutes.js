const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
const { volunteerMiddleware } = require('../middleware/roleMiddleware');

// Volunteer-only route example
router.get('/welcome-volunteer', authenticateJWT, volunteerMiddleware, (req, res) => {
    res.json({ success: true, message: 'Welcome Volunteer!', user: req.user });
});

module.exports = router;
