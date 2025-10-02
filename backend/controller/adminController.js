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

// New controller function to get monthly reported and resolved issue counts
const getAdminChartStats = async (req, res) => {
  try {
    // Aggregate reported issues by month
    const reportedAggregation = await Issue.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Aggregate resolved issues by month (status "Resolved")
    const resolvedAggregation = await Issue.aggregate([
      { $match: { status: "Resolved" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Merge months from both aggregations
    const monthsSet = new Set();
    reportedAggregation.forEach(item => monthsSet.add(item._id));
    resolvedAggregation.forEach(item => monthsSet.add(item._id));
    const monthsRaw = Array.from(monthsSet).sort();

    // Convert "YYYY-MM" to month abbreviation like "Jan", "Feb", etc.
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const months = monthsRaw.map(m => {
      const parts = m.split("-");
      const monthIndex = parseInt(parts[1], 10) - 1;
      return monthNames[monthIndex] || m;
    });

    // Prepare response data
    const reportedMap = new Map(reportedAggregation.map(item => [item._id, item.count]));
    const resolvedMap = new Map(resolvedAggregation.map(item => [item._id, item.count]));

    const reported = monthsRaw.map(month => reportedMap.get(month) || 0);
    const resolved = monthsRaw.map(month => resolvedMap.get(month) || 0);

    res.status(200).json({
      months,
      reported,
      resolved
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch chart stats", error: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAdminChartStats,
};
