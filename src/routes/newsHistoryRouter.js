const express = require("express");
const router = express.Router();
const { getNewsHistory } = require("../controllers/newsHistoryController");

router.get("/history/news", getNewsHistory);

module.exports = router;
