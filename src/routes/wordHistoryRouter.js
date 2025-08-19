const express = require("express");
const router = express.Router();
const { getWordByWeek } = require("../controllers/WordHistoryController");

router.get("/:studentId/history/word", getWordByWeek);

module.exports = router;
