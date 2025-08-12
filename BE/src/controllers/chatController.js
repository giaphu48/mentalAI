const {
  createNewSession,
  saveMessage,
  getChatHistory,
  getChatSessionsByUserId,
} = require("../models/chatModel");
const axios = require("axios");
const db = require("../configs/db");
const { v4: uuidv4 } = require("uuid");

async function generateAIReply(sessionId, userMessage) {
  const history = await getChatHistory(sessionId, 20);

  const formattedHistory = history.map((msg) => ({
    role: msg.sender === "client" ? "user" : "assistant",
    content: msg.message,
  }));

  try {
    const response = await axios.post("http://localhost:8000/chat", {
      question: userMessage,
      history: formattedHistory,
      k: 5,
      temperature: 0.2,
    });
    return response.data.answer || "(Không có phản hồi)";
    
  } catch (err) {
    console.error("Lỗi gọi chatbot Flask:", err);
    return "Xin lỗi, tôi không thể trả lời ngay lúc này.";
  }
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
        const session = await createNewSession(userId);
        sessionId = session.id;

        await saveMessage(sessionId, "client", message);

        const aiMessage = await generateAIReply(sessionId, message);

        await saveMessage(sessionId, "ai", aiMessage);

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

    await saveMessage(sessionId, "client", message);

    const aiMessage = await generateAIReply(sessionId, message);

    await saveMessage(sessionId, "ai", aiMessage);

    res.status(200).json({ reply: aiMessage, sessionId });
  } catch (err) {
    console.error("chatWithAI error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const analyzeChatSession = async (req, res) => {
  try {
    const { id: sessionId } = req.params;
    const { client_id } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Missing sessionId" });
    }

    // 1. Lấy lịch sử chat
    const history = await getChatHistory(sessionId, 100);
    if (history.length === 0) {
      return res
        .status(404)
        .json({ error: "No messages found for this session" });
    }

    // 2. Ghép thành chuỗi hội thoại
    const conversation = history
      .map(
        (msg) =>
          `${msg.sender === "client" ? "Người dùng" : "AI"}: ${msg.message}`
      )
      .join("\n");

    // 3. Gọi API Flask
    const flaskResponse = await axios.post("http://localhost:8000/analyze", {
      question: conversation,
    });

    const { emotion = "", behavior = "", advise = "" } = flaskResponse.data;
    const id = uuidv4();

    // 4. Lưu vào bảng emotion_diaries
    const insertQuery = `
      INSERT INTO emotion_diaries (id, client_id, emotion, behavior, advise, entry_date)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    await db.execute(insertQuery, [id, client_id, emotion, behavior, advise]);

    // 5. Trả kết quả cho client
    return res.status(200).json({
      sessionId,
      analysis: { emotion, behavior, advise },
    });
  } catch (err) {
    console.error("analyzeChatSession error:", err.message);
    return res
      .status(500)
      .json({ error: "Server error", details: err.message });
  }
};

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
      role: msg.sender,
      timestamp: msg.created_at,
    }));

    res.status(200).json({
      sessionId,
      sessionName: history[0]?.session_name || "Phiên trò chuyện",
      sessionType: history[0]?.session_type,
      messages,
    });
  } catch (err) {
    console.error("getChatHistoryBySessionId error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const chatWithExpert = async function (req, res) {
  try {
    const { sessionId } = req.params;
    const { userId, message, userRole } = req.body;

    if (!sessionId || !userId || !message || !userRole) {
      return res.status(400).json({ message: "Thiếu dữ liệu" });
    }

    // 1. Kiểm tra session tồn tại và là loại expert
    const [sessions] = await db.query(
      `SELECT * FROM chat_sessions WHERE id = ? AND session_type = 'expert'`,
      [sessionId]
    );

    if (sessions.length === 0) {
      return res
        .status(404)
        .json({
          message: "Không tìm thấy session hoặc không phải loại expert",
        });
    }

    // 2. Lưu tin nhắn
    const messageId = uuidv4();
    const role = userRole === "expert" ? "expert" : "client";
    const now = new Date();

    await db.query(
      `INSERT INTO chat_messages (id, session_id, sender, message, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [messageId, sessionId, role, message, now]
    );

    // 3. Cập nhật last_message + updated_at trong session
    await db.query(
      `UPDATE chat_sessions
       SET last_message = ?, updated_at = ?
       WHERE id = ?`,
      [message, now, sessionId]
    );

    // 4. Trả về phản hồi (ở expert chat thì reply = chính tin nhắn vừa gửi)
    res.json({
      success: true,
      reply: message,
      messageId,
      role,
    });
  } catch (error) {
    console.error("❌ Lỗi khi gửi tin nhắn expert chat:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
}

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

module.exports = {
  chatWithAI,
  chatWithExpert,
  getChatHistoryBySessionId,
  getChatSessions,
  analyzeChatSession,
};
