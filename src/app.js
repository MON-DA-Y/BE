require("dotenv").config();

const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");

// 라우터 import
const attendanceRouter = require("./routes/attendanceRouter");
const progressRouter = require("./routes/progressRouter");
const weaknessRouter = require("./routes/weaknessRouter");
const quizResultRouter = require("./routes/quizResultRouter");
const wordHistoryRouter = require("./routes/wordHistoryRouter");
const newsHistoryRouter = require("./routes/newsHistoryRouter");
const seriesHistoryRouter = require("./routes/seriesHistoryRouter");
const monNewsRouter = require("./routes/monNewsRouter");
const monWordRouter = require("./routes/monWordRouter");
const monQuizRouter = require("./routes/monQuizRouter");
const studentInfoRouter = require("./routes/studentInfoRouter");
const signUpRouter = require("./routes/signUpRouter");
const logInRouter = require("./routes/logInRouter");
const parentInfoRouter = require("./routes/parentInfoRouter");
const studentMainRouter = require("./routes/studentMainRouter");
const syncRouter = require("./routes/syncRouter");
const monSeriesRouter = require("./routes/monSeriesRouter");

const app = express();

// CORS 설정
const corsOptions = {
  origin: "https://mondayfe.netlify.app", // 프론트엔드 주소
  method: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // 허용 HTTP 메서드
  allowedHeaders: ["Content-Type", "Authorization"], // 허용 헤더
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

// 기본 라우트
app.get("/", (req, res) => res.send("백엔드 시작!"));

// 라우트 등록
app.use("/api/sync", syncRouter);
app.use("/api/users", attendanceRouter);
app.use("/api/users", progressRouter);
app.use("/api/users", weaknessRouter);
app.use("/api/users", quizResultRouter);
app.use("/api/users", wordHistoryRouter);
app.use("/api/users", newsHistoryRouter);
app.use("/api/users", seriesHistoryRouter);
app.use("/api/monNews", monNewsRouter);
app.use("/api/monWord", monWordRouter);
app.use("/api/monQuiz", monQuizRouter);
app.use("/api/stdInfo", studentInfoRouter);
app.use("/api/prtInfo", parentInfoRouter);
app.use("/api/signUp", signUpRouter);
app.use("/api/login", logInRouter);
app.use("/api/std", studentMainRouter);
app.use("/api/monSeries", monSeriesRouter);

module.exports = serverless(app);
