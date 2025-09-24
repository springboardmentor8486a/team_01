const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
const User = require('../model/userModel');
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

// Temporary route to get user by email for testing
router.get('/user/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user: { name: user.name, email: user.email, profileImage: user.profileImage } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});



module.exports = router;
