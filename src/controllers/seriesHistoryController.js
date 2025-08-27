const { getStudentIdFromToken } = require("../auth/token");
const SeriesHistory = require("../models/seriesHistory");
const { getWeekRange } = require("../utils/week");

exports.getSeriesHistory = async (req, res) => {
  const studentId = getStudentIdFromToken(req) || 123;
  const weekQuery = req.query.week;

  try {
    const seriesData = await SeriesHistory.findOne({ studentId });
    if (!seriesData)
      return res.status(404).json({ message: "해당 학생의 시리즈 데이터가 없습니다." });

    const { weekStart, weekEnd } = getWeekRange({ weekNumber: weekQuery });

    const filteredSeries = seriesData.seriesList
      .filter((n) => {
        const seriesDate = new Date(n.learningDate);
        return seriesDate >= weekStart && seriesDate <= weekEnd;
      })
      .sort((a, b) => new Date(a.learningDate) - new Date(b.learningDate));

    res.json({ seriesList: filteredSeries });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};
