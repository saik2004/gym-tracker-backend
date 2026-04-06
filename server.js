import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import chatRoutes from "./routes/chatRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
// ✅ Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load .env correctly (IMPORTANT FIX)
dotenv.config({ path: path.join(__dirname, ".env") });

// ✅ Debug (REMOVE later)
console.log("GEMINI KEY CHECK:", process.env.GEMINI_API_KEY);

// ✅ Import Routes
import authRoutes from "./routes/authRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

// ✅ Create app
const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());




// ✅ Health check
app.get("/", (req, res) => {
  res.send("API running...");
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/conversations", conversationRoutes);

// ✅ Config
const PORT = process.env.PORT || 5000;

// ✅ Connect DB & Start Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Error ❌:", err.message);
    process.exit(1);
  });