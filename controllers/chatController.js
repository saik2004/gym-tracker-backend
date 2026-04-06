import Chat from "../models/chatModel.js";

export const getChatsByConversation = async (req, res) => {
  try {
    const { id } = req.params;

    const chats = await Chat.find({
      conversationId: id,
    }).sort({ createdAt: 1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};