const express = require("express");
const router = express.Router();
const { getNewsByWeek } = require("../controllers/newsHistoryController");

router.get("/:studentId/history/news", getNewsByWeek);

module.exports = router;
