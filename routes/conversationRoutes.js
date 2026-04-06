import express from "express";
import { updateConversation } from "../controllers/conversationController.js";

import {
  createConversation,
  getConversations,
  deleteConversation,
} from "../controllers/conversationController.js";

import { auth } from "../middleware/auth.js";

const router = express.Router();

// ➕ Create new chat
router.post("/", auth, createConversation);

// 📜 Get all chats
router.get("/", auth, getConversations);

// ❌ Delete chat
router.delete("/:id", auth, deleteConversation);

router.put("/:id", auth, updateConversation);

export default router;