const { getStudentIdFromToken } = require("../auth/token");
//const NewsHistory = require("../models/newsHistory");
const { getWeekRange } = require("../utils/week");

const DummyNewsHistory = {
  findOne: async ({ studentId }) => {
    return {
      studentId,
      newsList: [
        {
          newsId: 1,
          category: "MONEY",
          title: "제목",
          imgUrl: "",
          learningDate: "2025-09-05",
          isCorrect: true,
        },
      ],
    };
  },
};

exports.getNewsHistory = async (req, res) => {
  const studentId = getStudentIdFromToken(req) || 123;
  const weekQuery = req.query.week;

  try {
    const newsData = await DummyNewsHistory.findOne({ studentId });
    if (!newsData) return res.status(404).json({ message: "해당 학생의 뉴스 데이터가 없습니다." });

    function formatKSTDate(date) {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate()
      ).padStart(2, "0")}`;
    }

    const { weekStart, weekEnd } = getWeekRange(weekQuery);
    const startStr = formatKSTDate(weekStart);
    const endStr = formatKSTDate(weekEnd);

    const newsHistory = newsData.newsList.filter((r) => {
      return r.learningDate >= startStr && r.learningDate <= endStr;
    });

    res.json({ newsList: newsHistory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};
