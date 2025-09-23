const express = require("express");
const router = express.Router();
const { getWeaknessByWeek, getStudentWeakness } = require("../controllers/weaknessController");

router.get("/weakness", getWeaknessByWeek);
router.get("/:studentId/weakness", getStudentWeakness);

module.exports = router;
