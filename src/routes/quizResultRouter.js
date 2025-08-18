const express = require("express");
const router = express.Router();
const { getQuizResultByWeek } = require("../controllers/quizResultController");

router.get("/:studentId/quiz-result", getQuizResultByWeek);

module.exports = router;
