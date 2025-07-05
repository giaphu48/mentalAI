// middlewares/auth.js
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

const auth = (req, res, next) => {
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Không có token' });
    }

    const decoded = jwt.verify(token, process.env.DB_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(403).json({ message: 'Token không hợp lệ' });
  }
};

module.exports = auth;
