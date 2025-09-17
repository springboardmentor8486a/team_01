const express = require("express");
const router = express.Router();
const { getIssues, createIssue, getIssueStats, updateIssueStatus } = require("../controller/issueController");

// GET /api/issues - get all issues
router.get("/", getIssues);

// POST /api/issues - create a new issue
router.post("/", createIssue);

// GET /api/issues/stats - get issue stats for dashboard
router.get("/stats", getIssueStats);

// PUT /api/issues/:id - update issue status
router.put("/:id", updateIssueStatus);

module.exports = router;
