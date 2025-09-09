const { getStudentIdFromToken } = require("../auth/token");
//const QuizResult = require("../models/quizResult");
const { getWeekRange } = require("../utils/week");

const DummyQuizResult = {
  findOne: async ({ studentId }) => {
    return {
      studentId,
      results: [
        {
          quizId: "quiz-001",
          day: "2025-09-08",
          score: 80,
        },
        {
          quizId: "quiz-002",
          day: "2025-09-09",
          score: 60,
        },
        {
          quizId: "quiz-003",
          day: "2025-09-10",
          score: 90,
        },
      ],
    };
  },
};

exports.getQuizResultByWeek = async (req, res) => {
  const studentId = getStudentIdFromToken(req) || 123;
  const weekQuery = req.query.week;

  try {
    const result = await DummyQuizResult.findOne({ studentId });
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
      return r.day >= startStr && r.day <= endStr;
    });

    res.json({ results: resultsInWeek });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};
