require("dotenv").config();
const mysql = require("mysql2/promise");
const connectDB = require("../src/config/db");
const News = require("../src/models/monNews");

const monNewsSeed = async () => {
  try {
    await connectDB();

    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
    });

    const [rows] = await connection.execute(`
       SELECT 
        m.oa_id AS newsId,
        m.title,
        m.main AS body,
        m.summary,
        m.input_at,
        o.img_url AS imgUrl
      FROM mon_news m
      LEFT JOIN org_article_tb o
        ON m.oa_id = o.oa_id
      LIMIT 100
  `);

    const newsData = rows.map((row) => ({
      studentId: 1, // 필요시 수정
      newsList: [
        {
          newsId: row.newsId,
          learningDate: row.input_at ? new Date(row.input_at) : new Date(),
          title: row.title,
          imgUrl: row.imgUrl,
          body: row.body,
          summary: row.summary,
          createdAt: row.input_at,
        },
      ],
    }));

    // MongoDB에 저장
    await News.deleteMany();
    await News.insertMany(newsData);

    console.log("MongoDB 뉴스 데이터 삽입 완료!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

monNewsSeed();
