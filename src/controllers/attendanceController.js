const { getUserIdFromToken } = require("../utils/auth");
const Attendance = require("../models/attendance");
const { getWeekRange } = require("../utils/week");
const { ObjectId } = require("mongodb");

function formatKSTDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

// 오늘 출석 처리
exports.todayAttendance = async (req, res) => {
  const studentId = getUserIdFromToken(req, "student");
  const today = new Date();
  // 오늘 날짜 문자열(KST)
  const todayStr = formatKSTDate(today);

  try {
    let attendance = await Attendance.findOne({ studentId });
    if (!attendance) attendance = new Attendance({ studentId, days: [] });

    const existing = attendance.days.find((d) => formatKSTDate(new Date(d.day)) === todayStr);

    if (existing) existing.isAttended = true;
    else attendance.days.push({ day: today, isAttended: true });

    await attendance.save();
    res.json({ message: "오늘 출석 완료!", day: today.toISOString().split("T")[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "출석 처리 중 오류 발생" });
  }
};

// 특정 주차 출석 조회
exports.getAttendanceByWeek = async (req, res) => {
  const studentId = getUserIdFromToken(req, "student");
  const weekQuery = req.query.week;

  try {
    const attendance = await Attendance.findOne({ studentId });
    if (!attendance) return res.json({ days: [] });

    const { weekStart, weekEnd } = getWeekRange(weekQuery);
    const daysInWeek = [];

    for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
      const dayStr = formatKSTDate(d);
      const found = attendance.days.find((a) => formatKSTDate(new Date(a.day)) === dayStr);
      daysInWeek.push({
        day: dayStr,
        isAttended: found ? found.isAttended : false,
      });
    }

    res.json({ days: daysInWeek });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "출석 조회 중 오류 발생" });
  }
};

// 부모가 자녀 출석 조회
exports.getStudentAttendance = async (req, res) => {
  const studentId = req.params.studentId; // 부모가 요청할 때 자녀 ID
  const weekQuery = req.query.week;

  try {
    const attendance = await Attendance.findOne({ studentId: studentId });
    if (!attendance) return res.json({ days: [] });

    const { weekStart, weekEnd } = getWeekRange(weekQuery);
    const daysInWeek = [];

    for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
      const dayStr = formatKSTDate(d);
      const found = attendance.days.find((a) => formatKSTDate(new Date(a.day)) === dayStr);
      daysInWeek.push({
        day: dayStr,
        isAttended: found ? found.isAttended : false,
      });
    }

    res.json({ days: daysInWeek });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "자녀 출석 조회 중 오류 발생" });
  }
};
