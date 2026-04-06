import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: String,

  // optional password
  password: String,

  resetToken: String,
  resetTokenExpiry: Date,
});

export default mongoose.model("User", userSchema);