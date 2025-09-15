const express = require("express");
const router = express.Router();
const { getWeaknessByWeek } = require("../controllers/weaknessController");

router.get("/weakness", getWeaknessByWeek);

module.exports = router;
