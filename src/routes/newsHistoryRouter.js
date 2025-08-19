const express = require("express");
const router = express.Router();
const { getNewsHistory } = require("../controllers/NewsHistoryController");

router.get("/:studentId/history/news", getNewsHistory);

module.exports = router;
