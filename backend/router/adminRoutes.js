const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/roleMiddleware');
const {
  getAdminStats,
  getAdminChartStats,
  getAdminCircleStats,
  getAdminIssueManagement,
  getAdminIssueDetails,
  getAdminIssueDetailById,
  updateAdminIssueStatusPriority
} = require('../controller/adminController');

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

// New admin issue management route
router.get('/issuemanagement', authenticateJWT, adminMiddleware, getAdminIssueManagement);

// New admin issue details routes
router.get('/issuedetails', authenticateJWT, adminMiddleware, getAdminIssueDetails);
router.get('/issuedetails/:id', authenticateJWT, adminMiddleware, getAdminIssueDetailById);

// Update issue status and priority
router.put('/issuemanagement/:id', authenticateJWT, adminMiddleware, updateAdminIssueStatusPriority);

module.exports = router;
