import express from "express";
import { chatWithAI } from "../controllers/aiController.js";
import { auth } from "../middleware/auth.js"; // ✅ CORRECT

const router = express.Router();

router.post("/chat", auth, chatWithAI); // ✅ USE auth (not protect)

export default router;