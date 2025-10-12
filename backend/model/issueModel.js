const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

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
  image: { type: String, default: null }, // Optional field for issue image URL from Cloudinary
  reporterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },

  // New fields for comments and votes
  comments: [commentSchema],
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Issue", issueSchema);
