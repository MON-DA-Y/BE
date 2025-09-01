// utils/week.js
exports.getWeekRange = (weekQuery) => {
  const today = new Date();
  let start, end;

  if (weekQuery === "이번주") {
    const dayOfWeek = today.getDay(); // 0: 일요일
    start = new Date(today);
    start.setDate(today.getDate() - dayOfWeek + 1); // 월요일 시작
    end = new Date(start);
    end.setDate(start.getDate() + 6);
  } else if (weekQuery === "저번주") {
    const dayOfWeek = today.getDay();
    end = new Date(today);
    end.setDate(today.getDate() - dayOfWeek); // 지난 일요일
    start = new Date(end);
    start.setDate(end.getDate() - 6);
  } else {
    // fallback 안전 처리
    start = new Date(today);
    end = new Date(today);
  }

  return { weekStart: start, weekEnd: end };
};
