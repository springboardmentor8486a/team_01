const express = require("express");
const router = express.Router();
const { getIssues, getIssueById, createIssue, getIssueStats, updateIssueStatus, deleteIssue, upvoteIssue, downvoteIssue, addIssueComment, updateIssueComment, deleteIssueComment } = require("../controller/issueController");
const upload = require("../middleware/upload");
const authenticateJWT = require("../middleware/authMiddleware");

// GET /api/issues - get all issues
router.get("/", getIssues);

// GET /api/issues/:id - get a single issue with details
router.get("/:id", getIssueById);

// POST /api/issues - create a new issue
router.post("/", authenticateJWT, upload.single('image'), createIssue);

// POST /api/issues/:id/comment - add a comment to an issue
router.post("/:id/comment", authenticateJWT, addComment);

// POST /api/issues/:id/upvote - upvote an issue
router.post("/:id/upvote", authenticateJWT, upvoteIssue);

// POST /api/issues/:id/downvote - downvote an issue
router.post("/:id/downvote", authenticateJWT, downvoteIssue);

// GET /api/issues/stats - get issue stats for dashboard
router.get("/stats", getIssueStats);

// GET /api/issues/:id - get issue by id
router.get("/:id", getIssueById);

// POST /api/issues/:id/upvote - toggle upvote
router.post("/:id/upvote", authenticateJWT, upvoteIssue);

// POST /api/issues/:id/downvote - toggle downvote
router.post("/:id/downvote", authenticateJWT, downvoteIssue);

// POST /api/issues/:id/comment - add a comment
router.post("/:id/comment", authenticateJWT, addIssueComment);

// PUT /api/issues/:id - update issue status
router.put("/:id", updateIssueStatus);

// DELETE /api/issues/:id - delete an issue
router.delete("/:id", deleteIssue);

// PUT /api/issues/:id/comment/:commentId - update a specific comment
router.put("/:id/comment/:commentId", authenticateJWT, updateIssueComment);

// DELETE /api/issues/:id/comment/:commentId - delete a specific comment
router.delete("/:id/comment/:commentId", authenticateJWT, deleteIssueComment);

module.exports = router;
