const express = require("express");
const router = express.Router();
const { getWordHistory, getParentWordHistory } = require("../controllers/wordHistoryController");

router.get("/history/word", getWordHistory);
router.get("/parent/history/word", getParentWordHistory);

module.exports = router;
