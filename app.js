require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");

const app = express();
const attendanceRouter = require("./src/routes/AttendanceRouter");
const progressRouter = require("./src/routes/ProgressRouter");
const weaknessRouter = require("./src/routes/WeaknessRouter");
const quizResultRouter = require("./src/routes/QuizResultRouter");
const wordHistoryRouter = require("./src/routes/WordHistoryRouter");
const newsHistoryRouter = require("./src/routes/NewsHistoryRouter");
const seriesHistoryRouter = require("./src/routes/SeriesHistoryRouter");

app.use(
  cors({
    origin: "http://localhost:3000", // 프론트 포트
  })
); // 다른 도메인 요청 허용
app.use(express.json()); // JSON 형식 body 파싱

// DB 연결 불러오기
connectDB();

// 기본 라우트
app.get("/", (req, res) => {
  res.send("백엔드 시작!");
});

// 출석률 조회
app.use("/api/users", attendanceRouter);
// 진도 현황 조회
app.use("/api/users", progressRouter);
// 약점 분석 조회
app.use("/api/users", weaknessRouter);
// 퀴즈 성적 조회
app.use("/api/users", quizResultRouter);
// 단어 히스토리 조회
app.use("/api/users", wordHistoryRouter);
// 뉴스 히스토리 조회
app.use("/api/users", newsHistoryRouter);
// 시리즈 히스토리 조회
app.use("/api/users", seriesHistoryRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버 시작: http://localhost:${PORT}`);
});
