const { v4: uuidv4 } = require('uuid');
const db = require('../configs/db');

/**
 * Tạo mới một appointment
 */
async function createAppointment(req, res) {
  try {
    const { client_id, expert_id } = req.body;

    if (!client_id || !expert_id) {
      return res.status(400).json({ message: 'Thiếu dữ liệu bắt buộc' });
    }

    // 1. Kiểm tra xem đã tồn tại request pending hoặc confirmed chưa
    const [existing] = await db.query(
      `SELECT id FROM requests 
       WHERE client_id = ? AND expert_id = ? 
         AND status IN ('pending', 'confirmed') 
       LIMIT 1`,
      [client_id, expert_id]
    );

    console.log(existing.length, 'existing requests found');

    if (existing.length > 0) {
      return res.status(400).json({
        message: 'Bạn đã có yêu cầu đang chờ hoặc đã xác nhận với chuyên gia này',
      });
    }

    const id = uuidv4();
    await db.query(
      `INSERT INTO requests (id, client_id, expert_id, status)
       VALUES (?, ?, ?, 'pending')`,
      [id, client_id, expert_id]
    );

    // 3. Gửi thông báo cho expert
    const message = 'Bạn có một yêu cầu tư vấn mới.';
    await db.query(
      `INSERT INTO notifications (id, user_id, message, type) VALUES (?, ?, ?, ?)`,
      [uuidv4(), expert_id, message, 'appointment']
    );

    res.status(201).json({
      appointment_id: id,
      message: 'Yêu cầu tư vấn đã được tạo',
    });
  } catch (error) {
    console.error('Lỗi khi tạo appointment:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
}


/**
 * Expert chấp nhận appointment
 */
async function acceptAppointment(req, res) {
  try {
    const { id } = req.params; // appointmentId
    const { clientId, expertId } = req.body; // lấy từ frontend gửi lên

    // Kiểm tra appointment tồn tại
    const [requests] = await db.query(
      `SELECT * FROM requests WHERE id = ?`,
      [id]
    );

    if (requests.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy appointment' });
    }

    // Cập nhật trạng thái appointment
    await db.query(
      `UPDATE requests SET status = 'confirmed' WHERE id = ?`,
      [id]
    );

    // Tạo chat session mới
    const sessionId = uuidv4();
    // Lấy tên khách hàng
    const [clientRows] = await db.query(
      `SELECT name FROM client_profiles WHERE user_id = ?`,
      [clientId]
    );
    const clientName = clientRows.length > 0 ? clientRows[0].name : 'khách hàng';
    const sessionName = `PTV của ${clientName}`;
    const startTime = new Date();

    await db.query(
      `INSERT INTO chat_sessions (id, session_name, start_time, session_type, client_id, expert_id, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        sessionId,
        sessionName,
        startTime,
        'expert',
        clientId,
        expertId,
        startTime
      ]
    );

    await db.query(
      `UPDATE requests SET session_id = ? WHERE id = ?`,
      [sessionId,id]
    );

    // Gửi thông báo cho client
    const message = `Chuyên gia đã chấp nhận yêu cầu tư vấn của bạn.`;
    await db.query(
      `INSERT INTO notifications (id, user_id, message, type)
       VALUES (?, ?, ?, ?)`,
      [uuidv4(), clientId, message, 'appointment']
    );

    res.json({
      message: 'Đã chấp nhận appointment, tạo phòng chat và gửi thông báo cho client',
      chatSessionId: sessionId
    });
  } catch (error) {
    console.error('❌ Lỗi khi chấp nhận appointment:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
}

/**
 * Expert từ chối appointment
 */
async function rejectAppointment(req, res) {
    try {
        const { id } = req.params;

        // Lấy appointment
        const [requests] = await db.query(
            `SELECT * FROM requests WHERE id = ?`,
            [id]
        );

        if (requests.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy appointment' });
        }

        const appointment = requests[0];

        // Cập nhật trạng thái
        await db.query(
            `UPDATE requests SET status = 'rejected' WHERE id = ?`,
            [id]
        );

        // Gửi thông báo cho client
        const message = `Chuyên gia đã từ chối yêu cầu tư vấn của bạn.`;
        await db.query(
            `INSERT INTO notifications (id, user_id, message, type) VALUES (?, ?, ?, ?)`,
            [uuidv4(), appointment.client_id, message, 'appointment']
        );

        res.json({ message: 'Đã từ chối appointment và gửi thông báo cho client' });
    } catch (error) {
        console.error('❌ Lỗi khi từ chối appointment:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
}

async function doneAppointment(req, res) {
    try {
        const { id } = req.params;

        // Lấy appointment
        const [requests] = await db.query(
            `SELECT * FROM requests WHERE id = ?`,
            [id]
        );

        if (requests.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy appointment' });
        }

        const appointment = requests[0];

        // Cập nhật trạng thái
        await db.query(
            `UPDATE requests SET status = 'done' WHERE id = ?`,
            [id]
        );

        // Gửi thông báo cho client
        const message = `Chuyên gia đã hoàn thành yêu cầu tư vấn của bạn.`;
        await db.query(
            `INSERT INTO notifications (id, user_id, message, type) VALUES (?, ?, ?, ?)`,
            [uuidv4(), appointment.client_id, message, 'appointment']
        );

        res.json({ message: 'Đã từ chối appointment và gửi thông báo cho client' });
    } catch (error) {
        console.error('❌ Lỗi khi từ chối appointment:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
}

async function getAllAppointmentsByExpert(req, res) {
  try {
    const { expert_id } = req.params;

    const [rows] = await db.query(
      `SELECT 
          a.id,
          a.client_id,
          a.expert_id,
          a.session_id,
          a.status,
          a.start_time,
          u.email,
          u.phone,
          cp.name AS fullName,
          cp.gender,
          cp.dob
        FROM requests a
        JOIN users u ON a.client_id = u.id
        LEFT JOIN client_profiles cp ON a.client_id = cp.user_id
        WHERE a.expert_id = ?`,
      [expert_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy appointment nào' });
    }

    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách appointment:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
}


module.exports = {
  createAppointment,
  acceptAppointment,
  rejectAppointment,
  getAllAppointmentsByExpert,
  doneAppointment
};
