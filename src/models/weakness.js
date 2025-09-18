require("dotenv").config();
const mongoose = require("mongoose");
const mysql = require("mysql2/promise");

const weaknessSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  weakWord: [
    {
      date: { type: Date, required: true }, // 해당 주의 시작일
      categories: [
        {
          category: { type: String, required: true },
          total: { type: Number, required: true },
          correct: { type: Number, required: true },
        },
      ],
    },
  ],
  weakNews: [
    {
      date: { type: Date, required: true }, // 해당 주의 시작일
      categories: [
        {
          category: { type: String, required: true },
          total: { type: Number, required: true },
          correct: { type: Number, required: true },
        },
      ],
    },
  ],
});

// MongoDB 모델
const Weakness = mongoose.model("Weakness", weaknessSchema);

// MySQL에서 최신 summary 가져오기
async function getLatestSummary(beId) {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      connectTimeout: 10000, // 10초
    });

    const [rows] = await connection.execute(
      `SELECT summary_words, summary_news 
     FROM mon_quiz_weakness_summary 
     WHERE be_id = ? 
     ORDER BY update_at DESC 
     LIMIT 1`,
      [beId]
    );

    console.log("Latest summary rows:", rows);
    return rows[0] || { summary_words: null, summary_news: null };
  } catch (err) {
    console.error("MySQL summary fetch error:", err);
    return { summary_words: null, summary_news: null };
  } finally {
    if (connection) await connection.end();
  }
}

module.exports = { Weakness, getLatestSummary };
