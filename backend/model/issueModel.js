const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true }, // e.g. "pothole", "streetlight"
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
  address: String,
  landmark: String,
  description: String,
  location: {
    lat: Number,
    lng: Number,
  },
  status: { type: String, enum: ["Pending", "In Progress", "Resolved"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Issue", issueSchema);
