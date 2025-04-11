const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express(); // ✅ THIS LINE MUST COME BEFORE app.use()

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth"); // Make sure path is correct
app.use("/api/auth", authRoutes); // ✅ Mount the auth routes

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
