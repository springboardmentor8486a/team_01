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

    const newIssue = new Issue({
      title: String(title),
      type: String(type),
      priority: priority || "Low",
      address: address || "",
      landmark: landmark || "",
      description: description || "",
      location,
      image: imageUrl,
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

module.exports = {
  getIssues,
  createIssue,
  getIssueStats,
  updateIssueStatus,
  deleteIssue,
};
