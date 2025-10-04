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

const getAdminCircleStats = async (req, res) => {
  try {
    // Define main categories to look for
    const mainCategories = [
      "Road Maintenance",
      "Lighting",
      "Waste Management",
      "Vandalism"
    ];

    // Aggregate issues by type and count
    const aggregation = await Issue.aggregate([
      {
        $group: {
          _id: { $ifNull: ["$type", "Other"] },  // Group undefined/null types as "Other"
          count: { $sum: 1 }
        }
      }
    ]);

    // Calculate total count of all issues
    const total = aggregation.reduce((acc, item) => acc + item.count, 0);

    // Initialize counts object
    let categoryCounts = {
      "Road Maintenance": 0,
      "Lighting": 0,
      "Waste Management": 0,
      "Vandalism": 0,
      "Other": 0
    };

    // Process aggregation results
    aggregation.forEach(item => {
      const category = item._id ? item._id.trim() : "Other";
      if (mainCategories.includes(category)) {
        categoryCounts[category] = item.count;
      } else {
        categoryCounts["Other"] += item.count;
      }
    });

    // Convert counts to percentages and format response
    const categories = Object.entries(categoryCounts)
      .map(([category, count]) => ({
        category,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0
      }))
      .filter(item => item.percentage > 0);  // Only include categories with issues

    res.status(200).json({
      categories
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch circle stats", error: error.message });
  }
};

// const Issue = require("../model/issueModel");
// const User = require("../model/userModel");

// Existing functions...

// New controller function to get issue management details
const getAdminIssueManagement = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate('reporterId', 'name fullName')
      .sort({ createdAt: -1 });

    // Format issues for response
    const formattedIssues = issues.map(issue => ({
      issue: {
        title: issue.title,
        address: issue.address || issue.landmark || "",
        description: issue.description || ""  // Added description field
      },
      status: issue.status,
      priority: issue.priority,
      category: issue.type,
      reportedBy: issue.reporterId ? (issue.reporterId.fullName || issue.reporterId.name) : "Unknown",
      date: issue.createdAt ? issue.createdAt.toLocaleDateString('en-GB') : ""
    }));

    res.status(200).json(formattedIssues);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch issue management data", error: error.message });
  }
};

const getAdminIssueDetails = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate('reporterId', 'name fullName')
      .sort({ createdAt: -1 });

    const formattedIssues = issues.map(issue => ({
      id: issue._id,
      title: issue.title,
      description: issue.description || "",
      address: issue.address || issue.landmark || "",
      status: issue.status,
      priority: issue.priority,
      category: issue.type,
      reportedBy: issue.reporterId ? (issue.reporterId.fullName || issue.reporterId.name) : "Unknown",
      date: issue.createdAt ? issue.createdAt.toLocaleDateString('en-GB') : "",
      upvotes: 5  // static value for now
    }));

    res.status(200).json(formattedIssues);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch issue details", error: error.message });
  }
};

const getAdminIssueDetailById = async (req, res) => {
  try {
    const issueId = req.params.id;
    const issue = await Issue.findById(issueId)
      .populate('reporterId', 'name fullName');

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const formattedIssue = {
      id: issue._id,
      title: issue.title,
      description: issue.description || "",
      address: issue.address || issue.landmark || "",
      status: issue.status,
      priority: issue.priority,
      category: issue.type,
      reportedBy: issue.reporterId ? (issue.reporterId.fullName || issue.reporterId.name) : "Unknown",
      date: issue.createdAt ? issue.createdAt.toLocaleDateString('en-GB') : "",
      upvotes: 5  // static value for now
    };

    res.status(200).json(formattedIssue);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch issue detail", error: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAdminChartStats,
  getAdminCircleStats,
  getAdminIssueManagement,
  getAdminIssueDetails,
  getAdminIssueDetailById,
};
