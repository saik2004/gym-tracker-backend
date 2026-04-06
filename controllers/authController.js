import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ REGISTER
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("👉 REGISTER:", email, password);

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("👉 HASHED:", hashedPassword);

    // Save user
    const user = await User.create({
      email,
      password: hashedPassword,
    });

    console.log("👉 USER SAVED:", user);

    res.json({ message: "User created" });
  } catch (err) {
    console.log("REGISTER ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// ✅ LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("👉 LOGIN:", email, password);

    const user = await User.findOne({ email });
    console.log("👉 USER FOUND:", user);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("👉 MATCH:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (err) {
    console.log("LOGIN ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};