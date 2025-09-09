const { getStudentIdFromToken } = require("../auth/token");
//const Weakness = require("../models/weakness");
const { getWeekRange } = require("../utils/week");

const DummyWeakness = {
  findOne: async ({ studentId }) => {
    // 학생 ID에 상관없이 같은 더미 데이터 반환
    return {
      studentId,
      weakWord: [
        {
          date: "2025-09-01", // 해당 주의 시작일
          categories: [
            { category: "MONEY", total: 10, correct: 7 },
            { category: "GLOBAL", total: 5, correct: 4 },
            { category: "BIGPICTURE", total: 8, correct: 3 },
            { category: "ISSUES", total: 7, correct: 3 },
          ],
          summary:
            "특히 거시경제와 정책/이슈에서 틀린 개수가 많아요. 이번 주에는 이 두 분야를 집중적으로 학습하면 좋겠어요!",
        },
      ],
      weakNews: [
        {
          date: "2025-09-01", // 해당 주의 시작일
          categories: [
            { category: "TECH", total: 10, correct: 7 },
            { category: "GLOBAL", total: 5, correct: 4 },
            { category: "BIGPICTURE", total: 8, correct: 3 },
            { category: "ISSUES", total: 7, correct: 3 },
          ],
          summary:
            "특히 거시경제와 정책/이슈에서 틀린 개수가 많아요. 이번 주에는 이 두 분야를 집중적으로 학습하면 좋겠어요!",
        },
      ],
    };
  },
};

exports.getWeaknessByWeek = async (req, res) => {
  const studentId = getStudentIdFromToken(req) || 1;
  const weekQuery = req.query.week;

  try {
    const weakness = await DummyWeakness.findOne({ studentId });
    if (!weakness) return res.json({ weakWord: null, weakNews: null });

    const { weekStart } = getWeekRange(weekQuery);
    const weekStartStr = weekStart.toISOString().split("T")[0];

    // weekStart와 일치하는 데이터 하나 가져오기
    const weekWeakWord = weakness.weakWord.find((w) => w.date === weekStartStr);
    const weekWeakNews = weakness.weakNews.find((w) => w.date === weekStartStr);

    res.json({
      weakWord: weekWeakWord || null,
      weakNews: weekWeakNews || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};
