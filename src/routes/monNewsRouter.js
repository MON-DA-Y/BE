const express = require("express");
const router = express.Router();
const {
  assignNewsToStudent,
  getTodayMonNews,
  postTodayMonNewsDone,
} = require("../controllers/monNewsController");

// 오늘 뉴스 배정
router.post("/assign", assignNewsToStudent);

// 오늘 뉴스 조회
router.get("/", getTodayMonNews);

// 오늘 뉴스 학습 완료
router.post("/done", postTodayMonNewsDone);

module.exports = router;
