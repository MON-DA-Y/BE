const express = require("express");
const router = express.Router();
const { getSeriesHistory } = require("../controllers/seriesHistoryController");

router.get("/history/series", getSeriesHistory);

module.exports = router;
