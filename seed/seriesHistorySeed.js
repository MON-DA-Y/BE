require("dotenv").config();
const mysql = require("mysql2/promise");
const connectDB = require("../src/config/db");
const SeriesHistory = require("../src/models/seriesHistory");

const seriesHistorySeed = async () => {
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
        m.ms_id AS seriesId,
        m.title AS title,
        m.main_keyword AS keyword,
        MIN(o.img_url) AS imgUrl
      FROM mon_series m
      LEFT JOIN mon_series_articles s
        ON m.ms_id = s.ms_id
      LEFT JOIN org_article_tb o
        ON s.oa_id = o.oa_id
      GROUP BY m.ms_id, m.title, m.main_keyword
      LIMIT 100 OFFSET 0
    `);

    // 4. MongoDB용으로 변환
    const seriesHistoryData = {
      studentId: 1, // 필요시 수정
      seriesList: rows.map((row) => {
        const parts = [
          {
            partId: row.partId,
            isLearned: false,
            part_title: row.p_title,
            part_sub_title: row.p_sub_title,
          },
        ];

        return {
          ...row, // 기존값 유지
          sub_title: row.sub_title,
          status: row.practice ?? "ongoing",
          learningDate: new Date().toISOString().split("T")[0],
          totalCount: parts.length,
          learnedCount: parts.filter((p) => p.isLearned).length,
          parts,
        };
      }),
    };

    // 5. MongoDB에 저장
    await SeriesHistory.deleteMany({ studentId: 1 });
    await SeriesHistory.insertMany(seriesHistoryData);

    console.log("MongoDB 시리즈 히스토리 데이터 삽입 완료!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seriesHistorySeed();
