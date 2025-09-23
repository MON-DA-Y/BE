const express = require("express");
const router = express.Router();
const {
  assignMonQuizToStudent,
  getTodayMonQuiz,
  postMonQuizSubmit,
  getTodayMonQuizMark,
  getStudentSubmit,
  getMonQuizActive,
} = require("../controllers/monQuizController");

// 오늘 퀴즈 배정
router.post("/assign", assignMonQuizToStudent);

// 오늘 mon퀴즈 조회
router.get("/", getTodayMonQuiz);

// 오늘 mon퀴즈 제출
router.post("/submit", postMonQuizSubmit);

// mon퀴즈 채점 조회
router.get("/mark", getTodayMonQuizMark);

// mon퀴즈 제출 여부
router.get("/submit/status", getStudentSubmit);

// mon퀴즈 활성화 여부
router.get("/active/status", getMonQuizActive);

module.exports = router;
