const express = require("express");
const router = express.Router();
const { getIssues, createIssue, getIssueStats, updateIssueStatus, deleteIssue } = require("../controller/issueController");
const upload = require("../middleware/upload");
const authenticateJWT = require("../middleware/authMiddleware");

// GET /api/issues - get all issues
router.get("/", getIssues);

// POST /api/issues - create a new issue
router.post("/", authenticateJWT, upload.single('image'), createIssue);

// GET /api/issues/stats - get issue stats for dashboard
router.get("/stats", getIssueStats);

// PUT /api/issues/:id - update issue status
router.put("/:id", updateIssueStatus);

// DELETE /api/issues/:id - delete an issue
router.delete("/:id", deleteIssue);

module.exports = router;
