import express from "express";
import upload from "../middleware/multerConfig.js";

const router = express.Router();


router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.json({
    message: "Upload berhasil",
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
  });
});

export default router;
