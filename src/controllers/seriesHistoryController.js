const { getUserIdFromToken } = require("../utils/auth");
const SeriesHistory = require("../models/seriesHistory");
const { getWeekRange } = require("../utils/week");

exports.getSeriesHistory = async (req, res) => {
  const studentId = getUserIdFromToken(req, "student") || 1;
  const weekQuery = req.query.week;

  try {
    const seriesData = await SeriesHistory.findOne({ studentId });
    if (!seriesData)
      return res.status(404).json({ message: "해당 학생의 시리즈 데이터가 없습니다." });

    const { weekStart, weekEnd } = getWeekRange(weekQuery);

    const seriesHistory = seriesData.seriesList.filter((r) => {
      const date = new Date(r.learningDate);
      return date >= weekStart && date <= weekEnd;
    });

    res.json({ seriesList: seriesHistory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};
