const express = require('express');
const router = express.Router();
const { registerVolunteer } = require('../controller/contactController');
const authenticateJWT = require('../middleware/authMiddleware');

// Test route to verify the router is working
router.get('/test', (req, res) => {
    res.status(200).json({ message: 'Contact routes are working' });
});

// Route for volunteer registration through contact form (requires authentication)
router.post('/volunteer', authenticateJWT, registerVolunteer);

module.exports = router;