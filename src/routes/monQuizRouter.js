const express = require("express");
const router = express.Router();
const { getTodayMonQuiz } = require("../controllers/monQuizController");

// 오늘 mon퀴즈 조회
router.get("/monQuiz", getTodayMonQuiz);

module.exports = router;
