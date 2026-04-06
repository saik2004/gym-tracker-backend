import Conversation from "../models/Conversation.js";
import Chat from "../models/chatModel.js";

export const createConversation = async (req, res) => {
  try {
    const newConversation = await Conversation.create({
      userId: req.user.id,
      title: "New Chat",
    });

    res.status(201).json(newConversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      userId: req.user.id,
    }).sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;

    await Conversation.findByIdAndDelete(id);
    await Chat.deleteMany({ conversationId: id });

    res.json({ message: "Conversation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateConversation = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Conversation.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};