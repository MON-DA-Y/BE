const express = require("express");
const router = express.Router();
const { postNewsHistory, getNewsHistory } = require("../controllers/newsHistoryController");

router.get("/history/news", postNewsHistory);
router.get("/history/news", getNewsHistory);

module.exports = router;
