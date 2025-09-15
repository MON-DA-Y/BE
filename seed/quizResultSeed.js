require("dotenv").config();
const mysql = require("mysql2/promise");
const connectDB = require("../src/config/db");
const quizResult = require("../src/models/quizResult");

const quizResultSeed = async () => {
  try {
    // 1. MongoDB 연결
    await connectDB();

    // 2. MySQL 원격 서버 연결
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
    });

    console.log("MySQL 연결 성공!");

    // 3. 필요한 데이터 쿼리
    const [rows] = await connection.execute(`
      SELECT 
        mq_id AS quizId
      FROM mon_quiz_items
      LIMIT 100 OFFSET 0
    `);

    // 4. MongoDB용으로 변환
    const quizResultData = {
      studentId: 1, // 필요시 수정
      results: rows.map((row) => ({
        quizId: row.quizId,
        day: new Date().toISOString().split("T")[0], // 현재 날짜
        score: null, // 이후에 isCorrect로 계산하기!!!
      })),
    };

    // 5. MongoDB에 저장
    await quizResult.deleteMany({ studentId: 1 });
    await quizResult.insertMany(quizResultData);

    console.log("MongoDB 퀴즈 성적 데이터 삽입 완료!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

quizResultSeed();
