const express = require("express");
const router = express.Router();
const { getIssues, createIssue, getIssueStats, updateIssueStatus } = require("../controller/issueController");
const upload = require("../middleware/upload");

// GET /api/issues - get all issues
router.get("/", getIssues);

// POST /api/issues - create a new issue
router.post("/", upload.single('image'), createIssue);

// GET /api/issues/stats - get issue stats for dashboard
router.get("/stats", getIssueStats);

// PUT /api/issues/:id - update issue status
router.put("/:id", updateIssueStatus);

module.exports = router;
