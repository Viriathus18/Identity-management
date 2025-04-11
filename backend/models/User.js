const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userID: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fingerprint: { type: String }, // Will hold fingerprint hash or identifier
});

module.exports = mongoose.model("User", UserSchema);
