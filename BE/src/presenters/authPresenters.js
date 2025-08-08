const bcrypt = require('bcryptjs');
const { serialize } = require('cookie');
const AuthModel = require('../models/User');
const jwtUtils = require('../utils/jwtUtils');

const AuthPresenter = {
  async login(email, password) {
    const user = await AuthModel.findUserByEmail(email);
    if (!user) throw new Error('INVALID_CREDENTIALS');

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new Error('INVALID_CREDENTIALS');

    const token = jwtUtils.signToken({
      id: user.id,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });

    const profile = await AuthModel.getProfileWithUserInfo(user);

    const cookie = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 2 * 60 * 60, // 2 giờ
    });

    return { user, profile, token, cookie };
  },

  async getMe(token) {
    let decoded;
    try {
      decoded = jwtUtils.verifyToken(token);
    } catch {
      throw new Error('INVALID_TOKEN');
    }

    const user = await AuthModel.findUserById(decoded.id);
    if (!user) throw new Error('NOT_FOUND');

    let profile = await AuthModel.getUserProfile(user.id, user.role);

    if (user.role === 'admin') profile = { name: 'Admin' };
    if (!profile) throw new Error('PROFILE_NOT_FOUND');

    return { ...user, ...profile };
  },

  async changePassword(userId, currentPassword, newPassword) {
    const user = await AuthModel.findUserById(userId);
    if (!user) throw new Error('NOT_FOUND');

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) throw new Error('WRONG_PASSWORD');

    const newHash = await bcrypt.hash(newPassword, 10);
    await AuthModel.updatePassword(userId, newHash);
  }
};

module.exports = AuthPresenter;
