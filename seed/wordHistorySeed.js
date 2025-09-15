require("dotenv").config();
const mysql = require("mysql2/promise");
const connectDB = require("../src/config/db");
const WordHistory = require("../src/models/wordHistory");

const wordHistorySeed = async () => {
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
      connectTimeout: 60000,
    });

    console.log("MySQL 연결 성공!");

    // 3. 필요한 데이터 쿼리
    const [rows] = await connection.execute(`
      SELECT 
        wi.mw_id AS wordId,
        wi.word AS word,
        wi.meaning AS meaning,
        wi.practice AS practice,
        oa.category AS category
      FROM mon_word_items wi
      JOIN mon_words w ON wi.mw_id = w.mw_id
      JOIN mon_news n ON w.mn_id = n.mn_id
      JOIN org_article_tb oa ON n.oa_id = oa.oa_id
      LIMIT 25 OFFSET 0;
    `);

    // 4. MongoDB용으로 변환
    const wordHistoryData = {
      studentId: 1, // 필요시 수정
      words: rows.map((row) => ({
        wordId: row.wordId,
        word: row.word,
        explain: row.meaning,
        use: row.practice,
        category: row.category || "default",
        learningDate: new Date().toISOString().split("T")[0], // 현재 날짜
        isCorrect: null, // 아직 채점 전
      })),
    };

    // 5. MongoDB에 저장
    await WordHistory.deleteMany({ studentId: 1 });
    await WordHistory.insertMany(wordHistoryData);

    console.log("MongoDB 단어 히스토리 데이터 삽입 완료!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

wordHistorySeed();
