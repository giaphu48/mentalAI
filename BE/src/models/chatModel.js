const db = require('../configs/db');
const { v4: uuidv4 } = require("uuid");

async function createNewSession(userId) {
  const [[{ count }]] = await db.query(
    "SELECT COUNT(*) as count FROM chat_sessions WHERE client_id = ?",
    [userId]
  );

  const sessionId = uuidv4();
  const sessionName = `Đoạn chat ${count + 1}`;

  await db.query(
    "INSERT INTO chat_sessions (id, client_id, session_name) VALUES (?, ?, ?)",
    [sessionId, userId, sessionName]
  );

  return { id: sessionId, session_name: sessionName };
}

async function findSessionById(sessionId, userId) {
  const [[session]] = await db.query(
    "SELECT * FROM chat_sessions WHERE id = ? AND client_id = ?",
    [sessionId, userId]
  );
  return session;
}

// 🔹 Lưu message (có thể mở rộng: trạng thái, loại, file...)
async function saveMessage(sessionId, sender, message) {
  const messageId = uuidv4();
  await db.query(
    "INSERT INTO chat_messages (id, session_id, sender, message) VALUES (?, ?, ?, ?)",
    [messageId, sessionId, sender, message]
  );
  await db.query(
    `
  UPDATE chat_sessions
  SET last_message = ?, updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`,
    [message, sessionId]
  );
  return messageId;
}

async function getChatHistory(sessionId, limit = 100) {
  const [rows] = await db.query(
    `SELECT id, sender, message, created_at 
     FROM chat_messages 
     WHERE session_id = ? 
     ORDER BY created_at ASC 
     LIMIT ?`,
    [sessionId, limit]
  );

  return rows.map((row) => ({
    id: row.id,
    sender: row.sender,
    message: row.message,
    created_at: row.created_at,
  }));
}

async function getChatSessionsByUserId(userId) {
  const [rows] = await db.query(
    `SELECT id, session_name, start_time, session_type, updated_at, last_message
     FROM chat_sessions
     WHERE client_id = ?
     ORDER BY start_time DESC`,
    [userId]
  );
  return rows;
}

module.exports = {
  createNewSession,
  saveMessage,
  getChatHistory,
  getChatSessionsByUserId,
};
