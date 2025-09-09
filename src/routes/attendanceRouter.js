const express = require("express");
const router = express.Router();
const { todayAttendance, getAttendanceByWeek } = require("../controllers/attendanceController");

router.post("/:studentId/attendance/today", todayAttendance);

router.get("/:studentId/attendance", getAttendanceByWeek);

module.exports = router;
