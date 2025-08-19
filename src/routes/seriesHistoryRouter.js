const express = require("express");
const router = express.Router();
const { getSeriesByWeek } = require("../controllers/SeriesHistoryController");

router.get("/:studentId/history/series", getSeriesByWeek);

module.exports = router;
