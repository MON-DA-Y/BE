const express = require("express");
const router = express.Router();
const { getAttendanceByWeek } = require("../controllers/AttendanceController");

router.get("/:studentId/attendance", getAttendanceByWeek);

module.exports = router;
