// 주차 계산
function getWeekRange({ weekNumber, referenceYear = new Date().getFullYear() } = {}) {
  let weekStart, weekEnd;

  if (weekNumber) {
    // 선택된 주차 계산
    const firstDayOfYear = new Date(referenceYear, 0, 1);
    const daysOffset = (parseInt(weekNumber, 10) - 1) * 7;
    const start = new Date(firstDayOfYear);
    start.setDate(firstDayOfYear.getDate() + daysOffset);

    const dayOfWeek = start.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // 월요일 기준
    weekStart = new Date(start);
    weekStart.setDate(start.getDate() + mondayOffset);
  } else {
    // 기본: 이번 주
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    weekStart = new Date(today);
    weekStart.setDate(today.getDate() + mondayOffset);
  }

  weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  return { weekStart, weekEnd };
}

module.exports = { getWeekRange };
