const express = require("express");
const router = express.Router();
const {
  getTodayMonQuiz,
  postMonQuizSubmit,
} = require("../controllers/monQuizController");

// 오늘 mon퀴즈 조회
router.get("/monQuiz", getTodayMonQuiz);

// 오늘 mon퀴즈 제출
router.post("/monQuiz/submit", postMonQuizSubmit);

module.exports = router;
