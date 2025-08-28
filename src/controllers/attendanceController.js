const { getStudentIdFromToken } = require("../auth/token");
const Attendance = require("../models/attendance");
const { getWeekRange } = require("../utils/week");

// 오늘 출석 처리
exports.todayAttendance = async (req, res) => {
  const studentId = getStudentIdFromToken(req) || 123;

  try {
    const today = new Date().toISOString().split("T")[0];
    let attendance = await Attendance.findOne({ studentId });
    if (!attendance) attendance = new Attendance({ studentId, days: [] });

    const existingDay = attendance.days.find((d) => d.day === today);
    if (existingDay) existingDay.isAttended = true;
    else attendance.days.push({ day: today, isAttended: true });

    await attendance.save();
    res.json({ message: "오늘 출석 완료!", day: today });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "출석 처리 중 오류 발생" });
  }
};

// 특정 주차 출석 조회
exports.getAttendanceByWeek = async (req, res) => {
  const studentId = getStudentIdFromToken(req) || 123;
  const weekQuery = req.query.week;

  try {
    const attendance = await Attendance.findOne({ studentId });
    if (!attendance) return res.json({ days: [] });

    const { weekStart, weekEnd } = getWeekRange({ weekNumber: weekQuery });

    const daysInWeek = [];
    for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
      const isoDay = d.toISOString().split("T")[0];
      const found = attendance.days.find((a) => a.day === isoDay);
      daysInWeek.push(found || { day: isoDay, isAttended: false });
    }

    res.json({ days: daysInWeek });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "출석 조회 중 오류 발생" });
  }
};
