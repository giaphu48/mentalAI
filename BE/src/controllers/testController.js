const db = require("../configs/db");

const createMbtiQuestions = async (req, res) => {
  const { question, dimension, options, option_values } = req.body;
  console.log(options)
  try {
    const [result] = await db.query(`
      INSERT INTO mbti_question (text, dimension)
      VALUES (?, ?)
    `, [question, dimension]);
    const questionId = result.insertId;

    const optionQueries = options.map((option, index) => {
      return db.query(`
        INSERT INTO mbti_option (question_id, option_text, option_value)
        VALUES (?, ?, ?)
      `, [questionId, option, option_values[index]]);
    });

    await Promise.all(optionQueries);
    res.status(201).json({ message: "Câu hỏi đã được tạo", questionId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi tạo câu hỏi" });
  }
};

const getAllMbtiQuestions = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        *
      FROM mbti_question
    `);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách rows" });
  }
};

// Lấy tất cả câu hỏi MBTI cùng các lựa chọn
const getAllMbtiQuiz= async (req, res) => {
  const limit  = Number(req.query.limit ?? 0);
  const offset = Number(req.query.offset ?? 0);
  const usePaging = Number.isInteger(limit) && limit > 0 && Number.isInteger(offset) && offset >= 0;

  const pick = (obj, candidates, def = null) => {
    for (const k of candidates) {
      if (obj[k] !== undefined && obj[k] !== null) return obj[k];
    }
    return def;
  };

  try {
    const baseSql = `
      SELECT
        q.*,
        o.id           AS o_id,
        o.option_text  AS o_text,
        o.option_value AS o_value
      FROM mbti_question AS q
      LEFT JOIN mbti_option AS o ON q.id = o.question_id
      ORDER BY q.id ASC, o.id ASC
    `;

    const pagedSql = `
      SELECT * FROM (
        ${baseSql}
      ) AS T
      LIMIT ? OFFSET ?
    `;

    const [rows] = usePaging
      ? await db.query(pagedSql, [limit, offset])
      : await db.query(baseSql);

    if (!rows || rows.length === 0) {
      return res.status(200).json([]);
    }

    const map = new Map();

    for (const r of rows) {
      // Cột của câu hỏi (từ q.*)
      const questionId = Number(pick(r, ["id", "question_id", "qid"]));
      const dimension  = pick(r, ["dimension", "dim"]);
      const question   = pick(r, ["question", "question_text", "text", "content", "title"]);

      if (!map.has(questionId)) {
        map.set(questionId, {
          id: questionId,
          dimension,
          question,
          options: [],
          option_values: [],
        });
      }

      const qObj = map.get(questionId);

      // Cột của option (đã alias rõ ràng)
      const optionId    = pick(r, ["o_id"]);
      const optionText  = pick(r, ["o_text"]);
      const optionValue = r.o_value != null ? Number(r.o_value) : null;

      // Bỏ qua dòng nếu không có option (do LEFT JOIN)
      if (optionText == null && optionValue == null) continue;

      qObj.options.push({
        id: optionId ?? null,
        option_text: optionText ?? "",
        option_value: optionValue,
      });
      if (optionValue != null) qObj.option_values.push(optionValue);
    }

    const result = Array.from(map.values()).sort((a, b) => a.id - b.id);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi khi lấy danh sách câu hỏi" });
  }
};



const getMbtiQuestionById = async (req, res) => {
  const { id } = req.params;
  const qid = Number(id);
  if (!Number.isInteger(qid)) {
    return res.status(400).json({ message: "ID không hợp lệ" });
  }

  try {
    const [rows] = await db.query(
      `
      SELECT
        q.*,
        o.*
      FROM mbti_question AS q
      LEFT JOIN mbti_option AS o ON q.id = o.question_id
      WHERE q.id = ?
      ORDER BY o.id ASC
      `,
      [qid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Câu hỏi không tồn tại" });
    }

    // Helper chọn tên cột thực tế
    const pick = (obj, candidates, defaultVal = null) => {
      for (const k of candidates) {
        if (obj[k] !== undefined && obj[k] !== null) return obj[k];
      }
      return defaultVal;
    };

    // Xác định tên cột của câu hỏi (tuỳ schema)
    const qRow = rows[0];
    const questionId = pick(qRow, ["id", "question_id", "qid"]);
    const dimension  = pick(qRow, ["dimension", "dim"]);
    const question   = pick(qRow, ["question", "text", "content", "question_text", "title"]);

    const base = {
      id: Number(questionId),
      dimension,
      question,
      options: [],
      option_values: [],
    };

    for (const r of rows) {
      // Tên cột của option tuỳ schema
      const optionId    = pick(r, ["o.id", "option_id", "id"]); // nếu trùng với q.id, bạn có thể đổi alias trong SQL (xem cách 2)
      const optionText  = pick(r, ["option_text", "text", "label", "content"]);
      const optionValue = pick(r, ["option_value", "value", "score", "weight"]);

      // Bỏ qua dòng nếu LEFT JOIN không có option
      if (optionText === null && optionValue === null) continue;

      base.options.push({
        id: optionId ?? null,
        option_text: optionText ?? "",
        option_value: optionValue != null ? Number(optionValue) : null,
      });
      if (optionValue != null) base.option_values.push(Number(optionValue));
    }

    return res.status(200).json(base);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi khi lấy câu hỏi" });
  }
};


const updateMbtiQuestion = async (req, res) => {
  const qidRaw = req.params.id;
  const questionId = Number(qidRaw);
  const { question, dimension, options = [], option_values = [] } = req.body;

  // Validate tối thiểu
  if (!Number.isInteger(questionId)) {
    return res.status(400).json({ message: "ID không hợp lệ." });
  }
  if (!question || typeof question !== "string" || question.trim().length < 5) {
    return res.status(400).json({ message: "Nội dung câu hỏi không hợp lệ (≥ 5 ký tự)." });
  }
  const DIMENSIONS = ["EI", "SN", "TF", "JP"];
  if (!dimension || !DIMENSIONS.includes(dimension)) {
    return res.status(400).json({ message: "Dimension không hợp lệ (EI/SN/TF/JP)." });
  }
  if (!Array.isArray(options) || !Array.isArray(option_values)) {
    return res.status(400).json({ message: "options/option_values phải là mảng." });
  }
  if (options.length !== option_values.length || options.length < 2) {
    return res.status(400).json({ message: "options và option_values phải cùng độ dài (>=2)." });
  }

  let conn;
  try {
    conn = await db.getConnection();
    await conn.beginTransaction();

    // CHÚ Ý: cột lưu nội dung là `text`, không phải `question`
    const [updateQ] = await conn.query(
      `UPDATE mbti_question SET text = ?, dimension = ? WHERE id = ?`,
      [question.trim(), dimension, questionId]
    );
    if (!updateQ.affectedRows) {
      await conn.rollback();
      return res.status(404).json({ message: "Không tìm thấy câu hỏi." });
    }

    await conn.query(`DELETE FROM mbti_option WHERE question_id = ?`, [questionId]);

    // Bulk insert options (tránh Promise.all)
    const placeholders = options.map(() => "(?, ?, ?)").join(",");
    const values = [];
    for (let i = 0; i < options.length; i++) {
      values.push(questionId, String(options[i]).trim(), Number(option_values[i]));
    }
    await conn.query(
      `INSERT INTO mbti_option (question_id, option_text, option_value) VALUES ${placeholders}`,
      values
    );

    await conn.commit();
    return res.status(200).json({ message: "Cập nhật câu hỏi thành công", questionId });
  } catch (error) {
    if (conn) {
      try { await conn.rollback(); } catch {}
    }
    console.error(error);

    // Thân thiện hơn khi gặp 1205/1213
    if (error?.code === "ER_LOCK_WAIT_TIMEOUT" || error?.code === "ER_LOCK_DEADLOCK") {
      return res.status(503).json({ message: "Hệ thống đang bận (lock). Vui lòng thử lại." });
    }

    return res.status(500).json({ message: "Lỗi khi cập nhật câu hỏi" });
  } finally {
    if (conn) conn.release();
  }
};

const deleteMbtiQuestion = async (req, res) => {
  const {id} = req.params;
  console.log(id)
  try {
    await db.query(`
      DELETE FROM mbti_option
      WHERE question_id = ?
    `, [id]);
    await db.query(`
      DELETE FROM mbti_question
      WHERE id = ?
    `, [id]);
    res.status(200).json({ message: "Câu hỏi đã được xóa" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi xóa câu hỏi" });
  }
}

module.exports = {
    getAllMbtiQuestions,
    getMbtiQuestionById,
    createMbtiQuestions,
    updateMbtiQuestion,
    deleteMbtiQuestion,
    getAllMbtiQuiz
};