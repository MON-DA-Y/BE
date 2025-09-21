const express = require("express");
const router = express.Router();
const {
  syncDailyNews,
  syncDailyWords,
} = require("../controllers/syncController");

// 오늘/지정일 뉴스 동기화
router.post("/news", syncDailyNews);

// 오늘/지정일 단어 동기화
router.post("/words", syncDailyWords);

module.exports = router;
