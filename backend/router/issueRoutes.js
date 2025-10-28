const express = require("express");
const router = express.Router();
const {
  getIssues,
  getIssueById,
  createIssue,
  getIssueStats,
  getMyIssueStats,
  updateIssueStatus,
  deleteIssue,
  upvoteIssue,
  downvoteIssue,
  addIssueComment,
  updateIssueComment,
  deleteIssueComment,
  getIssueByComplaintId
} = require("../controller/issueController");
const upload = require("../middleware/upload");
const authenticateJWT = require("../middleware/authMiddleware");

// GET /api/issues - get all issues
router.get("/", getIssues);

// POST /api/issues - create a new issue
router.post("/", authenticateJWT, upload.single('image'), createIssue);

// GET /api/issues/stats - get issue stats for dashboard
router.get("/stats", getIssueStats);

// GET /api/issues/my/stats - get stats for the authenticated user's issues
router.get("/my/stats", authenticateJWT, getMyIssueStats);

// GET /api/issues/track/:complaintId - get issue by complaintId (for tracking)
router.get("/track/:complaintId", getIssueByComplaintId);

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
