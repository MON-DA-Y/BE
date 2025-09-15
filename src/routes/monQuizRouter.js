const express = require("express");
const router = express.Router();
const {
  getTodayMonQuiz,
  postMonQuizSubmit,
  getTodayMonQuizMark,
} = require("../controllers/monQuizController");

// 오늘 mon퀴즈 조회
router.get("/monQuiz", getTodayMonQuiz);

// 오늘 mon퀴즈 제출
router.post("/monQuiz/submit", postMonQuizSubmit);

// mon퀴즈 채점 조회
router.get("/monQuiz/mark", getTodayMonQuizMark);

module.exports = router;
