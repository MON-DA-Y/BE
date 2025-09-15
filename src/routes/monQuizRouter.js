const express = require("express");
const router = express.Router();
const {
  getTodayMonQuiz,
  postMonQuizSubmit,
  getTodayMonQuizMark,
  postTodayMonQuizMarkDone,
  getStudentSubmit,
} = require("../controllers/monQuizController");

// 오늘 mon퀴즈 조회
router.get("/monQuiz", getTodayMonQuiz);

// 오늘 mon퀴즈 제출
router.post("/monQuiz/submit", postMonQuizSubmit);

// mon퀴즈 채점 조회
router.get("/monQuiz/mark", getTodayMonQuizMark);

// mon퀴즈 채점 학습/확인 완료
router.post("/monQuiz/done", postTodayMonQuizMarkDone);

// mon퀴즈 제출 여부
router.get("/monQuiz/submit/status", getStudentSubmit);

module.exports = router;
