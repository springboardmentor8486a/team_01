const express = require('express');
const router = express.Router();
const { submitFeedback } = require('../controller/feedbackController');
const authenticateJWT = require('../middleware/authMiddleware');

// Route for submitting feedback (requires authentication)
router.post('/submit', authenticateJWT, submitFeedback);

module.exports = router;
