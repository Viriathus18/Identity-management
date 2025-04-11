const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/register", async (req, res) => {
    const { userID, password, fingerprint } = req.body;
  
    try {
      const existingUser = await User.findOne({ userID });
      if (existingUser) return res.status(400).json({ msg: "User already exists" });
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ userID, password: hashedPassword, fingerprint });
  
      await newUser.save();
      res.status(201).json({ msg: "User registered successfully" });
    } catch (err) {
      console.error("Registration Error:", err); // 👈 add this
      res.status(500).json({ msg: "Server error" });
    }
  });

router.post("/login", async (req, res) => {
  const { userID, password } = req.body;

  try {
    const user = await User.findOne({ userID });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ userID: user.userID }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
