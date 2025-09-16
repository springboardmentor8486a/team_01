import express from "express";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.json({
      message: "Image uploaded successfully",
      url: req.file.path,
    });
  } catch (error) {
    console.error("Upload error:", error); // 👈 log the real issue
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

export default router;
