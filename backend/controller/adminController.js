const Issue = require("../model/issueModel");
const User = require("../model/userModel");

// Get admin stats for dashboard
const getAdminStats = async (req, res) => {
  try {
    // Issue stats
    const total = await Issue.countDocuments();
    const pending = await Issue.countDocuments({ status: "Pending" });
    const inProgress = await Issue.countDocuments({ status: "In Progress" });
    const resolved = await Issue.countDocuments({ status: "Resolved" });

    // Calculate date for one month ago
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Active users: users created or updated in the last month
    const activeUsers = await User.countDocuments({
      $or: [
        { createdAt: { $gte: oneMonthAgo } },
        { updatedAt: { $gte: oneMonthAgo } }
      ]
    });

    // Issues created in the last month
    const thisMonth = await Issue.countDocuments({ createdAt: { $gte: oneMonthAgo } });

    res.status(200).json({
      totalIssues: total,
      pending,
      inProgress,
      resolved,
      activeUsers,
      thisMonth
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin stats", error: error.message });
  }
};

module.exports = {
  getAdminStats,
};
