require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");

const app = express();

app.use(cors()); // 다른 도메인 요청 허용
app.use(express.json()); // JSON 형식 body 파싱

//DB 연결 불러오기
connectDB();

// 기본 라우트
app.get("/", (req, res) => {
  res.send("백엔드 시작!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버 시작: http://localhost:${PORT}`);
});
