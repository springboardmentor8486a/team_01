const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
// const { adminMiddleware, volunteerMiddleware } = require('../middleware/roleMiddleware');

// Home route - accessible to any authenticated user
router.get('/welcome-home', authenticateJWT, (req, res) => {
    // Destructure variables from token
    const { userId, role } = req.user;
    res.json({
        success: true,
        message: 'Welcome to the home route!',
        userId,
        role
    });
});



module.exports = router;
