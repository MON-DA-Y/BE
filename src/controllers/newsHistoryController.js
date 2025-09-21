const { getUserIdFromToken } = require("../utils/auth");
const StudentNews = require("../models/monNews");
const { getWeekRange } = require("../utils/week");

// 뉴스 히스토리 조회
exports.getNewsHistory = async (req, res) => {
  const studentId = getUserIdFromToken(req, "student");
  const weekQuery = req.query.week;

  try {
    const newsData = await StudentNews.findOne({ studentId });
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
