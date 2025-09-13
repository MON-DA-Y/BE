const { getUserIdFromToken } = require("../utils/auth");
const NewsHistory = require("../models/newsHistory");
const { getWeekRange } = require("../utils/week");

exports.getNewsHistory = async (req, res) => {
  const studentId = getUserIdFromToken(req, "student") || 1;
  const weekQuery = req.query.week;

  try {
    const newsData = await NewsHistory.findOne({ studentId });
    if (!newsData) return res.status(404).json({ message: "해당 학생의 뉴스 데이터가 없습니다." });

    const { weekStart, weekEnd } = getWeekRange(weekQuery);

    const newsHistory = newsData.newsList.filter((r) => {
      const date = new Date(r.learningDate);
      return date >= weekStart && date <= weekEnd;
    });

    res.json({ newsList: newsHistory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};
