const express = require("express");
const router = express.Router();
const {
  assignWordToStudent,
  getTodayMonWord,
  postWordItemUnderstand,
  postTodayMonWordDone,
} = require("../controllers/monWordController");

// 오늘 단어 배정
router.post("/monWord/assign", assignWordToStudent);

// 오늘 mon단어 조회
router.get("/monWord", getTodayMonWord);

// 오늘 mon단어 item 이해했어요
router.post("/monWord/understand", postWordItemUnderstand);

// 오늘 mon단어 학습 완료
router.post("/monWord/done", postTodayMonWordDone);

module.exports = router;
