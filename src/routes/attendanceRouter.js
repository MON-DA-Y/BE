const express = require("express");
const router = express.Router();
const {
  todayAttendance,
  getAttendanceByWeek,
  getStudentAttendance,
} = require("../controllers/attendanceController");

router.post("/attendance/today", todayAttendance);
router.get("/attendance", getAttendanceByWeek);
router.get("/:studentId/attendance", getStudentAttendance);

module.exports = router;
