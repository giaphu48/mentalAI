const jwt = require("jsonwebtoken");
const db = require("../configs/db");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
dotenv.config();
const jwtSecret = process.env.DB_TOKEN_SECRET || "default_secret_key";

const getAllExpert = async(req,res) => {
    try{
        const[experts] = await db.query(
            `SELECT
                users.id, users.email, users.phone, users.role,
                expert_profiles.user_id, expert_profiles.name, expert_profiles.certification
            FROM users
            JOIN expert_profiles ON users.id = expert_profiles.user_id
            WHERE role = 'expert'
            ORDER BY users.created_at DESC`
        );
        res.json(experts);
    }
    catch(err){
        console.error(err);
    }
};

const getExpertById = async (req, res) => {
  const { id } = req.params;

  try {
    const [users] = await db.query(
      `SELECT 
        users.id, users.email, users.phone, users.is_verified,
        expert_profiles.name, expert_profiles.gender, expert_profiles.dob, expert_profiles.certification, expert_profiles.bio, expert_profiles.avatar
      FROM users
      JOIN expert_profiles ON users.id = expert_profiles.user_id
      WHERE users.id = ? AND users.role = 'expert'`,
      [id]
    );

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy expert" });
    }

    res.json(users[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy thông tin expert" });
  }
};

const updateExpert = async (req, res) => {
  const { id } = req.params;
  const { email, phone, name, certification, gender, dob, bio, avatar } = req.body;

  try {
    // Update users table
    await db.query(
      `UPDATE users SET 
        email = COALESCE(?, email), 
        phone = COALESCE(?, phone) 
        WHERE id = ? AND role ='expert'`,
      [email, phone, id]
    );

    // Update expert_profiles table
    await db.query(
      `UPDATE expert_profiles SET 
        name = COALESCE(?, name),
        certification =  COALESCE(?, certification),
        gender = COALESCE(?, gender), 
        dob = COALESCE(?, dob), 
        avatar = COALESCE(?, avatar),
        bio = COALESCE(?, bio)
      WHERE user_id = ?`,
      [name, certification, gender, dob, avatar, bio ,id]
    );
    res.json({ message: "Cập nhật expert thành công" });
  } catch (error) {
    console.error(error);
    console.error("SQL ERROR:", error.code, error.sqlMessage || error.message);
    res.status(500).json({ message: "Lỗi khi cập nhật expert" });
  }
};

const uploadAvatar = async (req, res) => {
  const { id } = req.params;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const avatarUrl = file.path; // đường dẫn public trên Cloudinary

  try {
    await db.query("UPDATE expert_profiles SET avatar = ? WHERE user_id = ?", [
      avatarUrl,
      id,
    ]);
    res.status(200).json({ avatarUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
    getAllExpert,
    getExpertById,
    updateExpert,
    uploadAvatar
}