const express = require("express");
const router = express.Router();
const { getNewsByWeek } = require("../controllers/NewsHistoryController");

router.get("/:studentId/history/news", getNewsByWeek);

module.exports = router;
