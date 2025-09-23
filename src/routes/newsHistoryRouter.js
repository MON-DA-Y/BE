const express = require("express");
const router = express.Router();
const { getNewsHistory, getParentNewsHistory } = require("../controllers/newsHistoryController");

router.get("/history/news", getNewsHistory);
router.get("/parent/history/news", getParentNewsHistory);

module.exports = router;
