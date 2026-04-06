import express from "express";
import { getChatsByConversation } from "../controllers/chatController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// 📜 get chats of a conversation
router.get("/:id", auth, getChatsByConversation);

export default router;