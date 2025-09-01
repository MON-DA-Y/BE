const express = require("express");
const router = express.Router();
const { getWordHistory } = require("../controllers/wordHistoryController");

router.get("/:studentId/history/word", getWordHistory);

module.exports = router;
