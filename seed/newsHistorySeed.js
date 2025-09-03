require("dotenv").config();
const mysql = require("mysql2/promise");
const connectDB = require("../src/config/db");
const NewsHistory = require("../src/models/newsHistory");

const newsHistorySeed = async () => {
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
        m.oa_id AS newsId,
        m.title,
        o.category
        o.img_url AS imgUrl
      FROM mon_news m
      LEFT JOIN org_article_tb o
        ON m.oa_id = o.oa_id
      LIMIT 100
    `);
    console.log("MySQL에서 가져온 데이터:", rows);

    // 4. MongoDB용으로 변환
    const newsHistoryData = rows.map((row) => ({
      studentId: 1, // 필요시 수정
      newsList: [
        {
          newsId: row.newsId,
          title: row.title,
          imgUrl: row.imgUrl,
          category: row.category,
          learningDate: new Date(row.learningDate),
          isCorrect: true, // 예시, 필요시 로직 수정
        },
      ],
    }));
    console.log("MongoDB로 들어갈 데이터:", JSON.stringify(newsHistoryData, null, 2));

    // 5. MongoDB에 저장
    await NewsHistory.deleteMany();
    await NewsHistory.insertMany(newsHistoryData);

    console.log("MongoDB 뉴스 히스토리 데이터 삽입 완료!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

newsHistorySeed();
