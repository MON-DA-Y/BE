const express = require("express");
const router = express.Router();
const { todayAttendance, getAttendanceByWeek } = require("../controllers/attendanceController");

router.post("/attendance/today", todayAttendance);
router.get("/attendance", getAttendanceByWeek);

module.exports = router;
