const { getStudentIdFromToken } = require("../auth/token");
const QuizResult = require("../models/quizResult");
const { getWeekRange } = require("../utils/week");

exports.getQuizResultByWeek = async (req, res) => {
  const studentId = getStudentIdFromToken(req) || 123;
  const weekQuery = req.query.week;

  try {
    const result = await QuizResult.findOne({ studentId });
    if (!result)
      return res.status(404).json({ message: "해당 학생의 퀴즈 성적 데이터가 없습니다." });

    const { weekStart, weekEnd } = getWeekRange({ weekNumber: weekQuery });

    const resultInWeek = result.results
      .filter((n) => {
        const resultDate = new Date(n.day);
        return resultDate >= weekStart && resultDate <= weekEnd;
      })
      .sort((a, b) => new Date(a.day) - new Date(b.day));

    res.json({ results: resultInWeek });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};
