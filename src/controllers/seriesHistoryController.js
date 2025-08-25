const { getStudentIdFromToken } = require("../auth/token");
const SeriesHistory = require("../models/seriesHistory");

exports.getSeriesHistory = async (req, res) => {
  const { studentId } = getStudentIdFromToken(req) || 123;

  try {
    const seriesData = await SeriesHistory.findOne({ studentId });

    if (!seriesData) {
      return res.status(404).json({ message: "해당 학생의 시리즈 데이터가 없습니다." });
    }

    res.json({
      seriesList: seriesData.seriesList,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};
