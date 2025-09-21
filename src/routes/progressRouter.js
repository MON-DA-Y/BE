const express = require("express");
const router = express.Router();
const { getProgressByWeek, getStudentProgress } = require("../controllers/progressController");

router.get("/progress", getProgressByWeek);
router.get("/:studentId/progress", getStudentProgress);

module.exports = router;
