const { getStudentIdFromToken } = require("../auth/token");
const NewsHistory = require("../models/newsHistory");
const { getWeekRange } = require("../utils/week");

exports.getNewsHistory = async (req, res) => {
  const studentId = getStudentIdFromToken(req) || 123;
  const weekQuery = req.query.week;

  try {
    const newsData = await NewsHistory.findOne({ studentId });
    if (!newsData) return res.status(404).json({ message: "해당 학생의 뉴스 데이터가 없습니다." });

    const { weekStart, weekEnd } = getWeekRange({ weekNumber: weekQuery });

    const filteredNews = newsData.newsList
      .filter((n) => {
        const newsDate = new Date(n.learningDate);
        return newsDate >= weekStart && newsDate <= weekEnd;
      })
      .sort((a, b) => new Date(a.learningDate) - new Date(b.learningDate));

    res.json({ newsList: filteredNews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};
