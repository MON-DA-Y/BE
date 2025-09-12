const { getStudentIdFromToken } = require("../auth/token");
const Attendance = require("../models/attendance");
const { getWeekRange } = require("../utils/week");

// 오늘 출석 처리
exports.todayAttendance = async (req, res) => {
  const studentId = getStudentIdFromToken(req) || 1;

  try {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD

    let attendance = await Attendance.findOne({ studentId });
    if (!attendance) attendance = new Attendance({ studentId, days: [] });

    // 오늘 날짜 기존 기록 찾기
    const existingDay = attendance.days.find(
      (d) => new Date(d.day).toISOString().split("T")[0] === todayStr
    );

    if (existingDay) existingDay.isAttended = true; // 오늘 기록 이미 있으면 true
    else attendance.days.push({ day: today, isAttended: true }); // 없으면 새로 추가

    await attendance.save();
    res.json({ message: "오늘 출석 완료!", day: today });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "출석 처리 중 오류 발생" });
  }
};

// 특정 주차 출석 조회
exports.getAttendanceByWeek = async (req, res) => {
  const studentId = getStudentIdFromToken(req) || 1;
  const weekQuery = req.query.week; // "이번주" or "저번주"

  try {
    const attendance = await Attendance.findOne({ studentId });
    if (!attendance) return res.json({ days: [] });

    // 문자열 기준으로 날짜 범위 계산
    const { weekStart, weekEnd } = getWeekRange(weekQuery);

    function formatKSTDate(date) {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate()
      ).padStart(2, "0")}`;
    }

    const daysInWeek = [];
    for (let d = new Date(weekStart); d <= weekEnd; d.setDate(d.getDate() + 1)) {
      const isoDay = formatKSTDate(d);
      // DB의 day와 문자열 비교
      const found = attendance.days.find(
        (a) => new Date(a.day).toISOString().split("T")[0] === isoDay
      );
      daysInWeek.push(found || { day: isoDay, isAttended: false });
    }

    res.json({ days: daysInWeek });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "출석 조회 중 오류 발생" });
  }
};
