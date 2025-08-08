// middlewares/auth.js
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const dotenv = require('dotenv');

dotenv.config();

const jwtSecret = process.env.DB_TOKEN_SECRET || 'default_secret_key';

const authMiddleware = (req, res, next) => {
  try {
    // Đọc cookie từ header
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Không có token xác thực' });
    }

    // Xác minh token
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    return res.status(403).json({ message: 'Token không hợp lệ hoặc hết hạn' });
  }
};

module.exports = authMiddleware;
