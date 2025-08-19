const db = require("../configs/db");

const findUserByEmail = async (email) => {
  const [users] = await db.query(`SELECT * FROM users WHERE email = ?`, [email]);
  return users[0];
};

const findUserById = async (id) => {
  const [[user]] = await db.query(
    `SELECT id, email, phone, is_verified, role, password_hash FROM users WHERE id = ?`,
    [id]
  );
  return user;
};

const getUserProfile = async (id, role) => {
  let query = `
    SELECT 
      users.id, users.email, users.phone, users.is_verified, users.role,
      ${role === "client" 
        ? `client_profiles.name, client_profiles.dob, client_profiles.gender`
        : `expert_profiles.name, expert_profiles.certification, expert_profiles.bio, expert_profiles.approved_by_admin`
      }
    FROM users
    ${role === "client"
      ? `LEFT JOIN client_profiles ON users.id = client_profiles.user_id`
      : `LEFT JOIN expert_profiles ON users.id = expert_profiles.user_id`
    }
    WHERE users.id = ?
  `;

  const [profiles] = await db.query(query, [id]);
  return profiles[0] || null;
};

const getExpertProfile = async (userId) => {
  const [[expert]] = await db.query(
    `SELECT name, certification, gender, dob, avatar, bio, approved_by_admin FROM expert_profiles WHERE user_id = ?`,
    [userId]
  );
  return expert;
};

const getClientProfile = async (userId) => {
  const [[client]] = await db.query(
    `SELECT name, dob, gender, avatar FROM client_profiles WHERE user_id = ?`,
    [userId]
  );
  return client;
};

const updatePassword = async (userId, newHash) => {
  await db.query(`UPDATE users SET password_hash = ? WHERE id = ?`, [newHash, userId]);
};

module.exports = {
  findUserByEmail,
  findUserById,
  getUserProfile,
  getExpertProfile,
  getClientProfile,
  updatePassword
};
