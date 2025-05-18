const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth"); // Middleware to verify JWT

// Register route
router.post("/register", async (req, res) => {
  const { userID, password, fingerprint } = req.body;

  try {
    const existingUser = await User.findOne({ userID });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ userID, password: hashedPassword, fingerprint });

    await newUser.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    console.error("Registration Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { userID, password } = req.body;

  try {
    const user = await User.findOne({ userID });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, userID: user.userID }, // Include the MongoDB user ID
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// Face scan proxy
router.post("/scan-face", async (req, res) => {
  try {
    const flaskRes = await axios.post("http://localhost:6000/scan-face");
    res.status(200).json(flaskRes.data);
  } catch (err) {
    console.error("Face scan proxy error:", err.message);
    res.status(500).json({ error: "Face scan failed or server unavailable" });
  }
});

// Get current user
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});


// ✅ NEW: Secure route for dashboard
router.get("/secure-data", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("userID");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({
      message: "Secure data access granted",
      user: {
        name: user.userID, // Adjust if you have a "name" field
      },
    });
  } catch (err) {
    console.error("Secure data error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
