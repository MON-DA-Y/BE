const QuizResult = require("../models/quizResult");
const { getWeekRange } = require("../utils/week");

exports.getQuizResultByWeek = async (req, res) => {
  const studentId = req.params.studentId;
  const weekQuery = req.query.week;

  try {
    const result = await QuizResult.findOne({ studentId: studentId });
    if (!result)
      return res.status(404).json({ message: "해당 학생의 퀴즈 성적 데이터가 없습니다." });

    function formatKSTDate(date) {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate()
      ).padStart(2, "0")}`;
    }

    const { weekStart, weekEnd } = getWeekRange(weekQuery);
    const startStr = formatKSTDate(weekStart);
    const endStr = formatKSTDate(weekEnd);

    const resultsInWeek = result.results.filter((r) => {
      const dayStr = r.day.toISOString().slice(0, 10); // "YYYY-MM-DD"
      return dayStr >= startStr && dayStr <= endStr;
    });

    res.json({ results: resultsInWeek });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};
