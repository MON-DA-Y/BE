const express = require("express");
const router = express.Router();
const {
  getTodayMonWord,
  postWordItemUnderstand,
  postTodayMonWordDone,
} = require("../controllers/monWordController");

// 오늘 mon단어 조회
router.get("/monWord", getTodayMonWord);

// 오늘 mon단어 item 이해했어요
router.get("/monWord/understand", postWordItemUnderstand);

// 오늘 mon단어 학습 완료
router.post("/monWord/done", postTodayMonWordDone);

module.exports = router;
