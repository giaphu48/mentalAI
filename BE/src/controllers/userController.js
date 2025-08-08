const { serialize } = require("cookie");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

const {
  findUserByEmail,
  findUserById,
  getUserProfile,
  getExpertProfile,
  getClientProfile,
  updatePassword
} = require("../models/userModel");

const jwtSecret = process.env.DB_TOKEN_SECRET || "default_secret_key";

const userLogin = async (req, res) => {
  const { email, password_hash } = req.body;
  const password = password_hash || "";

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Lỗi khi đăng nhập" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
    }

    const token = jwt.sign({
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role
    }, jwtSecret, { expiresIn: "2h" });

    const profile = await getUserProfile(user.id, user.role);

    res.setHeader("Set-Cookie", serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 2 * 60 * 60
    }));

    return res.status(200).json({
      message: "Đăng nhập thành công",
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        is_verified: user.is_verified,
        role: user.role,
        profile
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Lỗi khi đăng nhập" });
  }
};

const logout = (req, res) => {
  try {
    const cookie = serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0
    });

    res.setHeader("Set-Cookie", cookie);
    return res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Lỗi server khi logout" });
  }
};

const getMe = async (req, res) => {
  try {
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

    const user = await findUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    let profile;
    if (user.role === "expert") {
      const expert = await getExpertProfile(user.id);
      if (!expert) return res.status(404).json({ message: "Không tìm thấy hồ sơ chuyên gia" });
      profile = { ...user, ...expert };
    } else if (user.role === "client") {
      const client = await getClientProfile(user.id);
      if (!client) return res.status(404).json({ message: "Không tìm thấy hồ sơ khách hàng" });
      profile = { ...user, ...client };
    } else if (user.role === "admin") {
      profile = { ...user, name: "Admin" };
    } else {
      return res.status(400).json({ message: "Loại người dùng không hợp lệ" });
    }

    return res.status(200).json(profile);
  } catch (err) {
    console.error("Lỗi getMe:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

const changePassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await updatePassword(userId, hashedNewPassword);

    return res.status(200).json({ message: "Đổi mật khẩu thành công" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

module.exports = {
  userLogin,
  logout,
  getMe,
  changePassword
};
