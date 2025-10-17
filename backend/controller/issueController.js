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

// Get single issue by id
const getIssueById = async (req, res) => {
  try {
    const { id } = req.params;
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    res.status(200).json(issue);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch issue", error: error.message });
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

// Upvote an issue (toggle upvote; removes downvote if present)
const upvoteIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user && req.user.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const uid = String(userId);
    const hasUp = Array.isArray(issue.upvotes) && issue.upvotes.some(u => String(u) === uid);
    const hasDown = Array.isArray(issue.downvotes) && issue.downvotes.some(u => String(u) === uid);

    if (hasUp) {
      // undo upvote
      issue.upvotes = issue.upvotes.filter(u => String(u) !== uid);
    } else {
      // add upvote and remove any downvote
      issue.upvotes = [...(issue.upvotes || []), userId];
      if (hasDown) {
        issue.downvotes = issue.downvotes.filter(u => String(u) !== uid);
      }
    }

    await issue.save();
    return res.status(200).json({
      _id: issue._id,
      upvotes: issue.upvotes,
      downvotes: issue.downvotes,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to upvote issue", error: error.message });
  }
};

// Downvote an issue (toggle downvote; removes upvote if present)
const downvoteIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user && req.user.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const uid = String(userId);
    const hasUp = Array.isArray(issue.upvotes) && issue.upvotes.some(u => String(u) === uid);
    const hasDown = Array.isArray(issue.downvotes) && issue.downvotes.some(u => String(u) === uid);

    if (hasDown) {
      // undo downvote
      issue.downvotes = issue.downvotes.filter(u => String(u) !== uid);
    } else {
      // add downvote and remove any upvote
      issue.downvotes = [...(issue.downvotes || []), userId];
      if (hasUp) {
        issue.upvotes = issue.upvotes.filter(u => String(u) !== uid);
      }
    }

    await issue.save();
    return res.status(200).json({
      _id: issue._id,
      upvotes: issue.upvotes,
      downvotes: issue.downvotes,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to downvote issue", error: error.message });
  }
};

// Add a comment to an issue
const addIssueComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user && req.user.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!text || String(text).trim().length === 0) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.comments = issue.comments || [];
    issue.comments.push({
      userId,
      text: String(text).trim(),
      createdAt: new Date(),
    });

    await issue.save();
    const newComment = issue.comments[issue.comments.length - 1];

    return res.status(201).json({ comment: newComment });
  } catch (error) {
    return res.status(500).json({ message: "Failed to add comment", error: error.message });
  }
};

// Update a comment on an issue
const updateIssueComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { text } = req.body;
    const userId = req.user && req.user.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!text || String(text).trim().length === 0) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const comment = issue.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (String(comment.userId) !== String(userId)) {
      return res.status(403).json({ message: "Forbidden: cannot edit others' comments" });
    }

    comment.text = String(text).trim();
    await issue.save();

    return res.status(200).json({ comment });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update comment", error: error.message });
  }
};

// Delete a comment from an issue
const deleteIssueComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const userId = req.user && req.user.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const comment = issue.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (String(comment.userId) !== String(userId)) {
      return res.status(403).json({ message: "Forbidden: cannot delete others' comments" });
    }

    comment.deleteOne();
    await issue.save();

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete comment", error: error.message });
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

module.exports = {
  getIssues,
  getIssueById,
  createIssue,
  getIssueStats,
  updateIssueStatus,
  upvoteIssue,
  downvoteIssue,
  addIssueComment,
  updateIssueComment,
  deleteIssueComment,
  deleteIssue,
};
