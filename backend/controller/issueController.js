const Issue = require("../model/issueModel");

// Get all issues
const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch issues", error: error.message });
  }
};

// Create a new issue
const createIssue = async (req, res) => {
  try {
    const { title, type, priority, address, landmark, description, location } = req.body;

    if (!title || !type) {
      return res.status(400).json({ message: "Title and type are required" });
    }

    const newIssue = new Issue({
      title,
      type,
      priority,
      address,
      landmark,
      description,
      location,
    });

    const savedIssue = await newIssue.save();
    res.status(201).json(savedIssue);
  } catch (error) {
    res.status(500).json({ message: "Failed to create issue", error: error.message });
  }
};

// Get issue stats for dashboard
const getIssueStats = async (req, res) => {
  try {
    const total = await Issue.countDocuments();
    const pending = await Issue.countDocuments({ status: "Pending" });
    const inProgress = await Issue.countDocuments({ status: "In Progress" });
    const resolved = await Issue.countDocuments({ status: "Resolved" });

    res.status(200).json({ total, pending, inProgress, resolved });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch issue stats", error: error.message });
  }
};

// Update issue status
const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Pending", "In Progress", "Resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedIssue = await Issue.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedIssue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.status(200).json(updatedIssue);
  } catch (error) {
    res.status(500).json({ message: "Failed to update issue status", error: error.message });
  }
};

module.exports = {
  getIssues,
  createIssue,
  getIssueStats,
  updateIssueStatus,
};
