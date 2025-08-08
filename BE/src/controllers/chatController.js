
const {
  createNewSession,
  saveMessage,
  getChatHistory,
  getChatSessionsByUserId,
} = require("../models/chatModel");
const { OpenAI } = require("openai");
const dotenv = require("dotenv");
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const getChatHistoryBySessionId = async (req, res) => {
  try {
    const { id: sessionId } = req.params;
    if (!sessionId) {
      return res.status(400).json({ error: "Missing sessionId" });
    }

    const history = await getChatHistory(sessionId, 100);

    const messages = history.map((msg) => ({
      id: msg.id,
      content: msg.message,
      role: msg.sender === "client" ? "client" : "ai",
      timestamp: msg.created_at,
    }));

    res.status(200).json({
      sessionId,
      messages,
    });
  } catch (err) {
    console.error("getChatHistoryBySessionId error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

async function generateAIReply(sessionId, userMessage) {
  const history = await getChatHistory(sessionId, 20);

  const formattedMessages = history.map((msg) => ({
    role: msg.sender === "client" ? "user" : "assistant",
    content: msg.message,
  }));

  formattedMessages.push({ role: "user", content: userMessage });

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: formattedMessages,
  });

  return completion.choices[0].message.content;
}

const chatWithAI = async (req, res) => {
  try {
    const { userId, message } = req.body;
    let sessionId = req.params.sessionId;

    if (!userId || !message) {
      return res.status(400).json({ error: "Missing userId or message" });
    }

    if (!sessionId) {
      try {
        // 1. Tạo session mới
        const session = await createNewSession(userId);
        sessionId = session.id;

        // 2. Lưu tin nhắn người dùng
        await saveMessage(sessionId, "client", message);

        // 3. Gọi OpenAI để tạo phản hồi
        const aiMessage = await generateAIReply(sessionId, message);

        // 4. Lưu phản hồi của AI
        await saveMessage(sessionId, "ai", aiMessage);

        // 5. Trả về sessionId, redirect và reply
        return res.status(201).json({
          message: "New session created",
          sessionId,
          redirect: `/chat/${sessionId}`,
          reply: aiMessage,
        });
      } catch (err) {
        console.error("Error creating new session:", err);
        return res.status(500).json({ error: "Failed to create session" });
      }
    }

    console.log(`Session ID: ${sessionId} for User ID: ${userId}`);

    // Session đã có
    await saveMessage(sessionId, "client", message);

    const aiMessage = await generateAIReply(sessionId, message);

    await saveMessage(sessionId, "ai", aiMessage);

    res.status(200).json({ reply: aiMessage, sessionId });
  } catch (err) {
    console.error("chatWithAI error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


const getChatSessions = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const sessions = await getChatSessionsByUserId(userId);
    res.json(sessions);
  } catch (error) {
    console.error("getChatSessionsByUserId error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { chatWithAI, getChatHistoryBySessionId, getChatSessions };
