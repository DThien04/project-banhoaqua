const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);
const User = mongoose.model("users", userSchema);
module.exports = User;
