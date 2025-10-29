const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Save images to "public/images/uploads" folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images/uploads")); 
    // 👆 gives correct absolute path for uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("image"), (req, res) => {
  // Return the image URL (relative to /public)
  res.json({ imageUrl: `/images/uploads/${req.file.filename}` });
  // 👆 starts from "/images" because Express serves "public" as static
});

module.exports = router;
