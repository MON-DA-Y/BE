require("dotenv").config();
const app = require("./app");
const connectMongoose = require("./config/db"); // MongoDB 연결
require("./cron/dailyCron"); // 스케줄러 등록

(async () => {
  try {
    await connectMongoose(); // MongoDB 연결

    const port = process.env.PORT || 80;
    app.listen(port, () => console.log(`서버 시작: http://localhost:${port}`));
  } catch (err) {
    console.error("서버 시작 실패:", err);
  }
})();
