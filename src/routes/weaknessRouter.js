const express = require("express");
const router = express.Router();
const { getWeaknessByWeek } = require("../controllers/WeaknessController");

router.get("/:studentId/weakness", getWeaknessByWeek);

module.exports = router;
