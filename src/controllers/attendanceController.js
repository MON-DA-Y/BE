//출석 더미데이터
const dummyAttendance = {
  //studentId
  1: {
    //week
    3: [
      { day: "2025-07-31", isAttended: true },
      { day: "2025-08-01", isAttended: false },
      { day: "2025-08-02", isAttended: true },
    ],
  },
  2: {
    3: [
      { day: "2025-04-14", isAttended: false },
      { day: "2025-04-15", isAttended: true },
    ],
  },
};

// 주차 시작일 계산 함수
function getWeekStartDate(year, weekNumber) {
  const augustFirst = new Date(year, 7, 1); // 더미데이터에 맞게 8월 1일부터 시작하게 설정
  // 3주차 시작일
  const weekStart = new Date(augustFirst);
  weekStart.setDate(augustFirst.getDate() + (weekNumber - 1) * 7);
  return augustFirst;
}

exports.getAttendanceByWeek = (req, res) => {
  const { studentId } = req.params;
  const { week } = req.query;

  if (!week) {
    return res.status(400).json({ message: "해당 주차를 선택해주세요." });
  }

  const attendance = dummyAttendance[studentId]?.[week] || [];
  // 주차 시작일 계산
  const weekStart = getWeekStartDate(2025, parseInt(week, 10));

  // 7일 동안 없는 날은 자동으로 isAttended: false
  const daysInWeek = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    const isoDay = day.toISOString().split("T")[0];
    const found = attendance.find((a) => a.day === isoDay);
    return found || { day: isoDay, isAttended: false };
  });

  res.json({
    week: parseInt(week, 10),
    days: daysInWeek,
  });
};
