const express = require("express");
const router = express.Router();
const {
  getStdMonWord,
  getStdMonNews,
  getTodayLearningRate,
} = require("../controllers/studentMainController");

// monWord 조회
router.get("/std/monWord", getStdMonWord);

// monNews 조회
router.get("/std/monNews", getStdMonNews);

// monSeries 조회
router.get("/std/monSeries");

// monSeries 카테고리 순위
router.get("/std/monSeries/category");

// TodayLearningRate 오늘의 학습률
router.get("/std/todayLearningRate", getTodayLearningRate);

// monQuiz 유무
router.get("/std/monQuiz/status");

module.exports = router;
