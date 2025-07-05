const { serialize } = require('cookie');
const jwt = require("jsonwebtoken");
const db = require("../configs/db");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
dotenv.config();
const jwtSecret = process.env.DB_TOKEN_SECRET || "default_secret_key";

const userLogin = async (req, res) => {
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
        phone: user.phone,
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
    let query = `
    SELECT 
      users.id, users.email, users.phone, users.is_verified, users.role,
      ${
      user.role === "client"
        ? `
      client_profiles.name, client_profiles.dob, client_profiles.gender
      `
        : `
      expert_profiles.name,
      expert_profiles.certification,
      expert_profiles.bio,
      expert_profiles.approved_by_admin
    `
    }
    FROM users
    ${
    user.role === "client"
      ? `
    LEFT JOIN client_profiles ON users.id = client_profiles.user_id
    `
      : `
    LEFT JOIN expert_profiles ON users.id = expert_profiles.user_id
    `
    }
    WHERE users.id = ?
    `;

    const [profiles] = await db.query(query, [user.id]);
    res.setHeader('Set-Cookie', serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 2 * 60 * 60, // 2 giờ
    }));

    return res.status(200).json({
      message: 'Đăng nhập thành công',
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        is_verified: user.is_verified,
        role: user.role,
        profile: profiles[0] || null,
      },
    });

    // res.json({
    //   token,
    //   user: {
    //     id: user.id,
    //     email: user.email,
    //     phone: user.phone,
    //     is_verified: user.is_verified,
    //     role: user.role,
    //     profile: profiles[0] || null,
    //   },
    // });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi đăng nhập" });
  }
};

const logout = (req, res) => {
  try {
    const cookie = serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0, // Xóa cookie
    });

    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({ message: 'Đăng xuất thành công' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ message: 'Lỗi server khi logout' });
  }
};

const getMe = async (req, res) => {
  try {
    // ✅ Lấy token từ cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Không có token xác thực" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (err) {
      return res.status(403).json({ message: "Token không hợp lệ" });
    }

    const userId = decoded.id;

    // ✅ Truy vấn người dùng từ bảng users
    const [[user]] = await db.query(
      `SELECT id, email, phone, is_verified, role FROM users WHERE id = ?`,
      [userId]
    );

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    let profile;

    if (user.role === 'expert') {
      const [[expert]] = await db.query(
        `SELECT name, certification, gender, dob, avatar, bio, approved_by_admin
         FROM expert_profiles
         WHERE user_id = ?`,
        [userId]
      );

      if (!expert) {
        return res.status(404).json({ message: "Không tìm thấy hồ sơ chuyên gia" });
      }

      profile = { ...user, ...expert };

    } else if (user.role === 'client') {
      const [[client]] = await db.query(
        `SELECT name, dob, gender
         FROM client_profiles
         WHERE user_id = ?`,
        [userId]
      );

      if (!client) {
        return res.status(404).json({ message: "Không tìm thấy hồ sơ khách hàng" });
      }

      profile = { ...user, ...client };

    } else if (user.role === 'admin') {
      // Admin không có bảng profile riêng
      profile = { ...user, name: "Admin" };
    } else {
      return res.status(400).json({ message: "Loại người dùng không hợp lệ" });
    }

    res.status(200).json(profile);
  } catch (err) {
    console.error("Lỗi getMe:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const changePassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  try {
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [
      hashedNewPassword,
      userId,
    ]);

    return res.status(200).json({ message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

module.exports = {
  userLogin,
  getMe,
  logout,
  changePassword
};
