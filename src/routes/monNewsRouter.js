const express = require("express");
const router = express.Router();
const {
  assignLevelToStudent,
  getTodayMonNews,
  postTodayMonNewsDone,
} = require("../controllers/monNewsController");

// 오늘 뉴스 배정
router.post("/monNews/assign", assignLevelToStudent);

// 오늘 뉴스 조회
router.get("/monNews", getTodayMonNews);

// 오늘 뉴스 학습 완료
router.post("/monNews/done", postTodayMonNewsDone);

module.exports = router;
