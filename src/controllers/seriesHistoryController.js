const { getStudentIdFromToken } = require("../auth/token");
//const SeriesHistory = require("../models/seriesHistory");
const { getWeekRange } = require("../utils/week");

const DummySeriesHistory = {
  findOne: async ({ studentId }) => {
    return {
      studentId,
      seriesList: [
        {
          seriesId: 1,
          title: "시리즈 제목",
          sub_title: "시리즈 부제목",
          keyword: "시리즈 부제목",
          status: "ongoing",
          learningDate: "2025-09-05",
          totalCount: 10,
          learnedCount: 7,
          imgUrl: "",
          parts: [
            {
              partId: 101,
              isLearned: true,
              part_title: "제목",
              part_sub_title: "부제목",
            },
          ],
        },
      ],
    };
  },
};

exports.getSeriesHistory = async (req, res) => {
  const studentId = getStudentIdFromToken(req) || 123;
  const weekQuery = req.query.week;

  try {
    const seriesData = await DummySeriesHistory.findOne({ studentId });
    if (!seriesData)
      return res.status(404).json({ message: "해당 학생의 시리즈 데이터가 없습니다." });

    function formatKSTDate(date) {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate()
      ).padStart(2, "0")}`;
    }

    const { weekStart, weekEnd } = getWeekRange(weekQuery);
    const startStr = formatKSTDate(weekStart);
    const endStr = formatKSTDate(weekEnd);

    const seriesHistory = seriesData.seriesList.filter((r) => {
      return r.learningDate >= startStr && r.learningDate <= endStr;
    });

    res.json({ seriesList: seriesHistory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};
