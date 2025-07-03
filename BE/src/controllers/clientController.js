const jwt = require("jsonwebtoken");
const db = require("../configs/db");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const e = require("express");
const jwtSecret = process.env.DB_TOKEN_SECRET || "default_secret_key";

const createClient = async (req, res) => {
  const { email, phone, password_hash, name, gender } = req.body;
  const id = uuidv4();

  console.log(email, phone, password_hash, name, gender);
  try {
    const password = await bcrypt.hash(password_hash, 10);

    // 1. Thêm vào bảng users
    await db.query(
      `INSERT INTO users (id, email, phone, password_hash, role, is_verified) VALUES (?, ?, ?, ?, 'client', false)`,
      [id, email, phone, password]
    );

    // 2. Thêm vào bảng client_profiles
    await db.query(
      `INSERT INTO client_profiles (user_id, name, gender, avatar) VALUES (?, ?, ?, ?)`,
      [id, name, gender, '']
    );

    res.status(201).json({ message: "Đăng ký client thành công", id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi đăng ký client" });
  }
};

const getClients = async (req, res) => {
  try {
    const [clients] = await db.query(`
      SELECT 
        users.id, users.email, users.phone, users.is_verified,
        client_profiles.name, client_profiles.dob, client_profiles.gender
      FROM users
      JOIN client_profiles ON users.id = client_profiles.user_id
      WHERE users.role = 'client'
      ORDER BY users.created_at DESC
    `);

    res.json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách clients" });
  }
};

const getClientById = async (req, res) => {
  const { id } = req.params;

  try {
    const [users] = await db.query(
      `SELECT 
        users.id, users.email, users.phone, users.is_verified,
        client_profiles.name, client_profiles.dob, client_profiles.gender
      FROM users
      JOIN client_profiles ON users.id = client_profiles.user_id
      WHERE users.id = ? AND users.role = 'client'`,
      [id]
    );

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy client" });
    }

    res.json(users[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy thông tin client" });
  }
};

const loginClient = async (req, res) => {
  const { email, password_hash } = req.body;

  password = password_hash || "";

  try {
    const [users] = await db.query(`SELECT * FROM users WHERE email = ?`, [
      email,
    ]);

    if (users.length === 0) {
      return res.status(401).json({ message: "Lỗi khi đăng nhập" });
    }

    const user = users[0];

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password_hash);
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      {
        expiresIn: "2h",
      }
    );
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng" });
    }

    // Lấy thông tin profile
    const [profiles] = await db.query(
      `SELECT 
        users.id, users.email, users.phone, users.is_verified,
        client_profiles.name, client_profiles.dob, client_profiles.gender
      FROM users
      JOIN client_profiles ON users.id = client_profiles.user_id
      WHERE users.id = ? AND users.role = 'client'`,
      [user.id]
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        is_verified: user.is_verified,
        profile: profiles[0] || null,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi đăng nhập" });
  }
};

const getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Không có token xác thực" });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (err) {
      return res.status(403).json({ message: "Token không hợp lệ" });
    }


    const userId = decoded.id;

    const [users] = await db.query(
      `SELECT 
        users.id, users.email, users.phone, users.is_verified,
        client_profiles.name, client_profiles.dob, client_profiles.gender, client_profiles.avatar
      FROM users
      JOIN client_profiles ON users.id = client_profiles.user_id
      WHERE users.id = ? AND users.role = 'client'`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.status(200).json(users[0]);
  } catch (err) {
    console.error("Lỗi getMe:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const getIdByEmail = async (req, res) => {
  const email = req.params.email;

  try {
    const [rows] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.status(200).json({ id: rows[0].id });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};


const verifyClient = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      `UPDATE users SET is_verified = true WHERE id = ? AND role = 'client'`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy client để xác thực" });
    }

    res.json({ message: "Xác thực client thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi xác thực client" });
  }
};

const deleteClient = async (req, res) => {
  const { id } = req.params;

  try {
    // Xóa profile client trước (nếu có ràng buộc khóa ngoại)
    await db.query(`DELETE FROM client_profiles WHERE user_id = ?`, [id]);

    // Xóa user
    await db.query(`DELETE FROM users WHERE id = ? AND role = 'client'`, [id]);

    res.json({ message: "Xóa client thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi xóa client" });
  }
};

const deleteAllClients = async (req, res) => {
  try {
    // Xóa tất cả client_profiles trước (nếu có ràng buộc khóa ngoại)
    await db.query(
      `DELETE FROM client_profiles WHERE user_id IN (SELECT id FROM users WHERE role = 'client')`
    );

    // Xóa tất cả users có role là 'client'
    await db.query(`DELETE FROM users WHERE role = 'client'`);

    res.json({ message: "Đã xóa tất cả clients thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi xóa tất cả clients" });
  }
};

const updateClient = async (req, res) => {
  const { id } = req.params;
  const { email, phone, name, gender, dob, avatar } = req.body;

  try {
    // Update users table
    if (email || phone) {
      await db.query(
        `UPDATE users SET email = COALESCE(?, email), phone = COALESCE(?, phone) WHERE id = ? AND role = 'client'`,
        [email, phone, id]
      );
    }

    // Update client_profiles table
    await db.query(
      `UPDATE client_profiles SET 
        name = COALESCE(?, name), 
        gender = COALESCE(?, gender), 
        dob = COALESCE(?, dob), 
        avatar = COALESCE(?, avatar)
      WHERE user_id = ?`,
      [name, gender, dob, avatar, id]
    );

    res.json({ message: "Cập nhật client thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi cập nhật client" });
  }
};

const changePassword = async (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    try {
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (!users || users.length === 0) return res.status(404).json({ message: 'User not found' });

        const user = users[0];
        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [hashedNewPassword, userId]);

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
  createClient,
  getClients,
  getClientById,
  getMe,
  deleteClient,
  deleteAllClients,
  loginClient,
  verifyClient,
  getIdByEmail,
  updateClient,
  changePassword
};
