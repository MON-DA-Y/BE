const { getUserIdFromToken } = require("../utils/auth");
//const Weakness = require("../models/weakness");
const { getWeekRange } = require("../utils/week");

const DummyWeakness = {
  findOne: async ({ studentId }) => {
    // 학생 ID에 상관없이 같은 더미 데이터 반환
    return {
      studentId,
      weakWord: [
        {
          date: "2025-09-14", // 전 주 일요일에 보내는 걸로 !
          categories: [
            { category: "MONEY", total: 10, correct: 7 },
            { category: "GLOBAL", total: 5, correct: 4 },
            { category: "BIGPICTURE", total: 8, correct: 3 },
            { category: "ISSUES", total: 7, correct: 3 },
            { category: "TECH", total: 7, correct: 3 },
          ],
          summary:
            "특히 거시경제와 정책/이슈에서 틀린 개수가 많아요. 이번 주에는 이 두 분야를 집중적으로 학습하면 좋겠어요!",
        },
      ],
      weakNews: [
        {
          date: "2025-09-14",
          categories: [
            { category: "TECH", total: 10, correct: 7 },
            { category: "GLOBAL", total: 5, correct: 4 },
            { category: "BIGPICTURE", total: 8, correct: 5 },
            { category: "ISSUES", total: 7, correct: 5 },
          ],
          summary:
            "특히 거시경제와 정책/이슈에서 틀린 개수가 많아요. 이번 주에는 이 두 분야를 집중적으로 학습하면 좋겠어요!",
        },
      ],
    };
  },
};

exports.getWeaknessByWeek = async (req, res) => {
  const studentId = getUserIdFromToken(req, "student") || 1;
  const weekQuery = req.query.week;

  try {
    const weakness = await DummyWeakness.findOne({ studentId });
    if (!weakness) return res.json({ weakWord: null, weakNews: null });

    const { weekStart } = getWeekRange(weekQuery);
    const weekStartStr = weekStart.toISOString().split("T")[0];

    // 임계값
    const threshold = 50;

    // week, 임계값 조건에 맞는 데이터 필터링
    const weekWeakWord = weakness.weakWord.find((w) => w.date === weekStartStr);
    const filteredWordCategories = weekWeakWord
      ? weekWeakWord.categories.filter((c) => (c.correct / c.total) * 100 < threshold)
      : [];

    const weekWeakNews = weakness.weakNews.find((w) => w.date === weekStartStr);
    const filteredNewsCategories = weekWeakNews
      ? weekWeakNews.categories.filter((c) => (c.correct / c.total) * 100 < threshold)
      : [];

    res.json({
      weakWord: {
        date: weekStartStr,
        summary: weekWeakWord?.summary || null,
        categories: filteredWordCategories,
      },
      weakNews: {
        date: weekStartStr,
        summary: weekWeakNews?.summary || null,
        categories: filteredNewsCategories,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};
