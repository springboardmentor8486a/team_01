const Issue = require("../model/issueModel");
const { uploadToCloudinary } = require("../helpers/cloudinaryHelper");

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
// Create a new issue
const createIssue = async (req, res) => {
  try {
    // console.log("Request body:", req.body);
    // console.log("Request file:", req.file);

    const { title, type, priority, address, landmark, description, lat, lng } = req.body;

    // Simple validation - just check if they exist and have content
    if (!title || !type || String(title).length === 0 || String(type).length === 0) {
      return res.status(400).json({ 
        message: "Title and type are required",
        debug: {
          title: title,
          type: type,
          titleType: typeof title,
          typeType: typeof type
        }
      });
    }

    // Parse location if lat and lng are provided
    let location = null;
    if (lat && lng) {
      location = {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      };
    }

    let imageUrl = null;
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, 'infosys_project');
        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
      }
    }

    if (!req.user || !req.user.userId) {
      console.error("Authentication error: req.user or req.user.userId is missing");
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }

    const newIssue = new Issue({
      title: String(title),
      type: String(type),
      priority: priority || "Low",
      address: address || "",
      landmark: landmark || "",
      description: description || "",
      location,
      image: imageUrl,
      reporterId: req.user.userId,
    });

    const savedIssue = await newIssue.save();
    res.status(201).json(savedIssue);
  } catch (error) {
    console.error("Create issue error:", error);
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

// Delete an issue
const deleteIssue = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedIssue = await Issue.findByIdAndDelete(id);

    if (!deletedIssue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.status(200).json({ message: "Issue deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete issue", error: error.message });
  }
};

// Get a single issue by ID with comments and votes
const getIssueById = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await Issue.findById(id).populate('comments.userId', 'name email').populate('upvotes', 'name').populate('downvotes', 'name');
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    res.status(200).json(issue);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch issue", error: error.message });
  }
};

// Add a comment to an issue
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user.userId;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const comment = {
      userId,
      text: text.trim(),
    };

    issue.comments.push(comment);
    await issue.save();

    // Populate the new comment for response
    await issue.populate('comments.userId', 'name email');

    res.status(201).json({ message: "Comment added", issue });
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment", error: error.message });
  }
};

// Upvote an issue
const upvoteIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Remove from downvotes if present
    issue.downvotes = issue.downvotes.filter(id => id.toString() !== userId);

    // Toggle upvote
    const upvoteIndex = issue.upvotes.findIndex(id => id.toString() === userId);
    if (upvoteIndex > -1) {
      issue.upvotes.splice(upvoteIndex, 1);
    } else {
      issue.upvotes.push(userId);
    }

    await issue.save();
    res.status(200).json({ message: "Upvote updated", upvotes: issue.upvotes.length, downvotes: issue.downvotes.length });
  } catch (error) {
    res.status(500).json({ message: "Failed to upvote issue", error: error.message });
  }
};

// Downvote an issue
const downvoteIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Remove from upvotes if present
    issue.upvotes = issue.upvotes.filter(id => id.toString() !== userId);

    // Toggle downvote
    const downvoteIndex = issue.downvotes.findIndex(id => id.toString() === userId);
    if (downvoteIndex > -1) {
      issue.downvotes.splice(downvoteIndex, 1);
    } else {
      issue.downvotes.push(userId);
    }

    await issue.save();
    res.status(200).json({ message: "Downvote updated", upvotes: issue.upvotes.length, downvotes: issue.downvotes.length });
  } catch (error) {
    res.status(500).json({ message: "Failed to downvote issue", error: error.message });
  }
};

module.exports = {
  getIssues,
  createIssue,
  getIssueStats,
  updateIssueStatus,
  deleteIssue,
  getIssueById,
  addComment,
  upvoteIssue,
  downvoteIssue,
};
