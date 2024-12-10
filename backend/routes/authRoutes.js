const express = require("express");
const { registerUser, loginUser, getUser, updateUser } = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Register Route
router.post("/register", upload.single("profile_picture"), registerUser);

// Login Route
router.post("/login", loginUser);

// Get User Data Route
router.get("/user", verifyToken, getUser);

// Update User Route
router.put("/user", verifyToken, updateUser);

module.exports = router;
