const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
const User = require('../model/userModel');
const { sendEmail } = require('../helpers/emailService');
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

// Submit feedback (sends email via Nodemailer)
router.post('/feedback', async (req, res) => {
    try {
        const { service, rating, comments, email } = req.body || {};
        const to = process.env.FEEDBACK_TO || process.env.EMAIL_USER;
        if (!to) {
            return res.status(500).json({ success: false, message: 'Feedback recipient not configured on server' });
        }
        const subject = `CleanStreet Feedback${rating ? ` (Rating: ${rating}/5)` : ''}`;
        const textLines = [
            `Feedback received from: ${email || 'Anonymous user'}`,
            service ? `Related service/issue: ${service}` : null,
            '',
            'Comments:',
            comments || '(no comments provided)',
            '',
            `Submitted at: ${new Date().toISOString()}`
        ].filter(Boolean);
        await sendEmail(to, subject, textLines.join('\n'));
        return res.status(200).json({ success: true, message: 'Feedback sent successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to send feedback', error: error.message });
    }
});

module.exports = router;
