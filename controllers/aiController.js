import fetch from "node-fetch";
import Chat from "../models/chatModel.js";
import Conversation from "../models/Conversation.js";

export const chatWithAI = async (req, res) => {
  try {
    const {
      question,
      workouts = [],
      history = [],
      conversationId,
    } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    if (!conversationId) {
      return res.status(400).json({ message: "Conversation ID is required" });
    }

    // ✅ 1. Clean workout data
    const formattedWorkouts = workouts.slice(-15).map((w) => ({
      date: w.date,
      week: w.week,
      split: w.splitType,
      exercises: w.exercises?.map((ex) => ({
        name: ex.name,
        sets: ex.sets,
      })),
      cardio: w.cardio,
    }));

    // ✅ 2. System prompt
    const systemPrompt = `
You are a highly advanced, professional AI fitness coach. 

CORE BEHAVIOR & TONE:
- Balance empathy with candor: Validate the user's emotions and frustrations, but ground your responses strictly in physiological facts, science, and reality. 
- Gently correct any fitness misconceptions without being condescending.
- Be honest about your AI nature; never feign personal gym experiences, injuries, or feelings.
- Mirror the user's tone, formality, energy, and humor. Match their communication style exactly.
- Provide clear, insightful, and straightforward answers. Address the user's primary question immediately.

RESPONSE LENGTH, PROGRESSION & FOLLOW-UPS:
- Conversational Wrap-ups (CRITICAL OVERRIDE): If the user says "okay", "thanks", "got it", or otherwise signals they are closing the conversation, you must output a maximum of 1 or 2 sentences acknowledging them. STRICTLY DO NOT offer unprompted advice or new workout details, and STRICTLY DO NOT ask a follow-up question. Let the conversation end naturally.
- Direct/Factual Queries: If the user's prompt has a definitive answer give the complete answer and STRICTLY DO NOT ask any follow-up questions at the end.
- Advisory/Broad Queries: If the prompt is broad or explicitly seeks advice, provide the advice and end with EXACTLY ONE highly relevant follow-up question to guide the user forward.
- Missing Information: If you need more details to give safe advice, provide a partial helpful response and explicitly ask for the missing details.

USING USER CONTEXT (SEAMLESS INTEGRATION):
- Treat past user data (goals, current workout split, diet, preferences) as shared mental context.
- Weave this context seamlessly into your advice without narrating that you are doing so.
- STRICT RULE: Never use prefatory clauses. Never say "Based on your goal...", "Since you are on an upper/lower split...", or "As you mentioned before...". 

FORMATTING & STRUCTURE (CRITICAL):
- Structure every response for high scannability and visual clarity. 
- Use Markdown headings (###), horizontal rules (---), and tables to organize data.
- Use standard bullet points (-) for lists, keeping text concise.
- STRICTLY AVOID nested bullet points and nested lists.
- Use bolding (**text**) to emphasize key phrases, target numbers, and muscle groups.
`;

    // ✅ 3. Chat history
    const chatHistory = history.slice(-6).map((msg) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.text,
    }));

    // ✅ 4. User prompt
    const userPrompt = `
User Question:
${question}

Workout History:
${JSON.stringify(formattedWorkouts, null, 2)}
`;

    // ✅ 5. API call
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://gym-tracker-frontend-beryl.vercel.app",
          "X-Title": "Gym AI Coach",
        },
        body: JSON.stringify({
          model: "anthropic/claude-3.5-haiku",
          messages: [
            { role: "system", content: systemPrompt },
            ...chatHistory,
            { role: "user", content: userPrompt },
          ],
          temperature: 0.6,
          max_tokens: 800,
        }),
      }
    );

    const data = await response.json();
    console.log("FULL AI RESPONSE:", JSON.stringify(data, null, 2));

    // ✅ 6. Extract response
    let reply =
      data?.choices?.[0]?.message?.content ||
      data?.error?.message ||
      "No response from AI";

    // ✅ 7. Just trim
    reply = reply.trim();

    // ✅ 8. AUTO TITLE (ONLY FIRST MESSAGE)
    const existingChats = await Chat.countDocuments({ conversationId });
    if (existingChats === 0) {
      const title = await generateTitle(question);
      await Conversation.findByIdAndUpdate(conversationId, { title });
    }

    // ✅ 9. SAVE CHAT
    const chat = await Chat.create({
      userId: req.user.id,
      conversationId,
      question,
      answer: reply,
    });

    // ✅ 10. Response
    res.json({
      answer: reply,
      chatId: chat._id,
    });

  } catch (error) {
    console.error("AI Error:", error.message);
    res.status(500).json({
      message: "AI failed",
      error: error.message,
    });
  }
};

// ✅ TITLE GENERATOR
export const generateTitle = async (text) => {
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "anthropic/claude-3.5-haiku",
          messages: [
            {
              role: "system",
              content: "Generate a short 3-5 word title. No punctuation. Clean words only.",
            },
            {
              role: "user",
              content: text,
            },
          ],
          max_tokens: 10,
        }),
      }
    );

    const data = await response.json();
    return (
      data?.choices?.[0]?.message?.content?.trim() ||
      text.slice(0, 20)
    );
  } catch (err) {
    return text.slice(0, 20);
  }
};