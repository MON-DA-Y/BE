const { getStudentIdFromToken } = require("../auth/token");
//const Attendance = require("../models/attendance");
const { getWeekRange } = require("../utils/week");

const DummyAttendance = {
  findOne: async ({ studentId }) => {
    // 학생 ID에 상관없이 같은 더미 데이터 반환
    return {
      studentId,
      days: [
        { day: "2025-08-25", isAttended: true },
        { day: "2025-08-26", isAttended: false },
        { day: "2025-08-27", isAttended: true },
        { day: "2025-08-28", isAttended: true },
        { day: "2025-08-29", isAttended: false },
        { day: "2025-08-30", isAttended: true },
        { day: "2025-08-31", isAttended: false },
        { day: "2025-09-01", isAttended: true },
      ],
    };
  },
};

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
  const weekQuery = req.query.week; // "이번주" or "저번주"

  try {
    const attendance = await DummyAttendance.findOne({ studentId });
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
      const isoDay = formatKSTDate(d); // KST 기준 날짜
      const found = attendance.days.find((a) => a.day === isoDay);
      daysInWeek.push(found || { day: isoDay, isAttended: false });
    }

    res.json({ days: daysInWeek });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "출석 조회 중 오류 발생" });
  }
};
