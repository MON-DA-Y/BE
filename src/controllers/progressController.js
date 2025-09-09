const { getStudentIdFromToken } = require("../auth/token");
const Progress = require("../models/progress");
const { getWeekRange } = require("../utils/week");

exports.getProgressByWeek = async (req, res) => {
  const studentId = getStudentIdFromToken(req) || 1;
  const weekQuery = req.query.week;

  try {
    const progress = await Progress.findOne({ studentId });
    if (!progress) return res.status(404).json({ message: "해당 학생의 진도 데이터가 없습니다." });

    const { weekStart, weekEnd } = getWeekRange({ weekNumber: weekQuery });

    const progressInWeek = progress.days.filter((n) => {
      const progressDate = new Date(n.day);
      return progressDate >= weekStart && progressDate <= weekEnd;
    });

    progressInWeek.sort((a, b) => new Date(a.day) - new Date(b.day));

    res.json({ days: progressInWeek });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};
