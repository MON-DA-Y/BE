const express = require("express");
const router = express.Router();
const { getProgressByWeek } = require("../controllers/progressController");

router.get("/:studentId/progress", getProgressByWeek);

module.exports = router;
