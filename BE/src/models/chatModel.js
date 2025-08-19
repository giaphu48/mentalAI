const { get } = require('http');
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
    `SELECT 
        m.id, 
        m.sender, 
        m.message, 
        m.created_at, 
        s.session_type,
        s.session_name,
        s.status
     FROM chat_messages AS m
     JOIN chat_sessions AS s 
       ON m.session_id = s.id
     WHERE m.session_id = ? 
     ORDER BY m.created_at ASC 
     LIMIT ?`,
    [sessionId, limit]
  );

  return rows.map((row) => ({
    id: row.id,
    sender: row.sender,
    message: row.message,
    created_at: row.created_at,
    session_name: row.session_name,
    session_type: row.session_type,
    status: row.status,
  }));
}


async function getChatSessionsByUserId(userId) {
  const [rows] = await db.query(
    `SELECT cs.id,
            cs.session_name,
            cs.start_time,
            cs.session_type,
            cs.updated_at,
            cs.last_message,
            cp.name AS client_name
     FROM chat_sessions cs
     LEFT JOIN client_profiles cp 
       ON cs.client_id = cp.user_id
     WHERE cs.client_id = ? OR cs.expert_id = ?
     ORDER BY cs.updated_at DESC`,
    [userId, userId]
  );
  return rows;
}

async function getChatSessionsById(sessionId) {
  const [[session]] = await db.query(
    "SELECT * FROM chat_sessions WHERE id = ?",
    [sessionId]
  );
  return session;
}

async function saveEmotionDiary(sessionId, emotion, behavior, advise) {
  const query = `
    INSERT INTO emotion_diaries (session_id, emotion, behavior, advise, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;
  await db.execute(query, [sessionId, emotion, behavior, advise]);
}

module.exports = {
  createNewSession,
  saveMessage,
  getChatHistory,
  getChatSessionsByUserId,
  findSessionById,
  getChatSessionsById
};
