const express = require("express");
const router = express.Router();
const {
  getStdMonWord,
  getStdMonNews,
  getTodayLearningRate,
  getStdMonSeries,
} = require("../controllers/studentMainController");

// monWord 조회
router.get("/monWord", getStdMonWord);

// monNews 조회
router.get("/monNews", getStdMonNews);

// monSeries 조회
router.get("/monSeries", getStdMonSeries);

// monSeries 카테고리 순위
router.get("/monSeries/category");

// TodayLearningRate 오늘의 학습률
router.get("/todayLearningRate", getTodayLearningRate);

module.exports = router;
