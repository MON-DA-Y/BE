require("dotenv").config();

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

const app = express();

// CORS 설정
const corsOptions = {
  origin: "http://localhost:3000", // 프론트엔드 주소
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
app.use("/api", monNewsRouter);
app.use("/api", monWordRouter);
app.use("/api", monQuizRouter);
app.use("/api", studentInfoRouter);
app.use("/api", parentInfoRouter);
app.use("/api", signUpRouter);
app.use("/api", logInRouter);
app.use("/api", studentMainRouter);

module.exports = app;
