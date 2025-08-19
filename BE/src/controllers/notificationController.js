const { v4: uuidv4 } = require('uuid');
const db = require('../configs/db');

// Lấy tất cả thông báo của 1 user
async function getNotificationsByUser(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Thiếu user_id' });
    }


    const [rows] = await db.query(
      `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`,
      [id]
    );
    res.json(rows);
  } catch (error) {
    console.error('❌ Lỗi khi lấy thông báo:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

// Tạo thông báo mới
async function createNotification(req, res) {
  try {
    const { user_id, message, type } = req.body;

    if (!user_id || !message || !type) {
      return res.status(400).json({ message: 'Thiếu dữ liệu' });
    }

    const id = uuidv4();
    await db.query(
      `INSERT INTO notifications (id, user_id, message, type) VALUES (?, ?, ?, ?)`,
      [id, user_id, message, type]
    );

    res.status(201).json({ id, user_id, message, type });
  } catch (error) {
    console.error('❌ Lỗi khi tạo thông báo:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
}

// Đánh dấu thông báo đã đọc
async function markNotificationAsRead(req, res) {
  try {
    const { notification_id } = req.params;
    await db.query(
      `UPDATE notifications SET is_read = TRUE WHERE id = ?`,
      [notification_id]
    );
    res.json({ message: 'Thông báo đã được đánh dấu là đã đọc' });
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật thông báo:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
}

async function markAllNotificationsAsRead(req, res) {
  try {
    const { user_id } = req.params;
    await db.query(
      `UPDATE notifications SET is_read = TRUE WHERE user_id = ?`,
      [user_id]
    );
    res.json({ message: 'Tất cả thông báo đã được đánh dấu là đã đọc' });
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật thông báo:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
}

module.exports = {
  getNotificationsByUser,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead
};
