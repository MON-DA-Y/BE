const express = require("express");
const router = express.Router();
const { getProgressByWeek } = require("../controllers/ProgressController");

router.get("/:studentId/progress", getProgressByWeek);

module.exports = router;
