const express = require("express");
const router = express.Router();
const { syncDailyNews } = require("../controllers/syncController");

// 오늘/지정일 뉴스 동기화
router.post("/news", syncDailyNews);

module.exports = router;
