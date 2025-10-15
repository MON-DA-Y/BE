const { getUserIdFromToken } = require("../utils/auth");
const { getWeekRange } = require("../utils/week");
const { getLatestSummary } = require("../models/weakness");

const DummyWeakness = {
  findOne: async ({ studentId }) => {
    // 학생 ID에 상관없이 같은 더미 데이터 반환
    return {
      studentId,
      weakWord: [
        {
          date: "2025-10-13", // 퀴즈 보고 다음주의 시작일 !
          categories: [
            { category: "cg00", total: 10, correct: 7 },
            { category: "cg02", total: 5, correct: 4 },
            { category: "cg04", total: 8, correct: 3 },
            { category: "cg07", total: 7, correct: 3 },
            { category: "cg01", total: 7, correct: 3 },
          ],
          summary_words:
            "특히 거시경제와 정책/이슈에서 틀린 개수가 많아요. 이번 주에는 이 두 분야를 집중적으로 학습하면 좋겠어요!",
        },
      ],
      weakNews: [
        {
          date: "2025-10-13",
          categories: [
            { category: "cg00", total: 10, correct: 7 },
            { category: "cg02", total: 5, correct: 4 },
            { category: "cg05", total: 8, correct: 5 },
            { category: "cg06", total: 7, correct: 5 },
          ],
          summary_news:
            "특히 거시경제와 정책/이슈에서 틀린 개수가 많아요. 이번 주에는 이 두 분야를 집중적으로 학습하면 좋겠어요!",
        },
      ],
    };
  },
};

exports.getWeaknessByWeek = async (req, res) => {
  const studentId = getUserIdFromToken(req, "student");
  const weekQuery = req.query.week;

  try {
    const weakness = await DummyWeakness.findOne({ studentId });
    if (!weakness) return res.json({ weakWord: null, weakNews: null });

    function formatKSTDate(date) {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate()
      ).padStart(2, "0")}`;
    }

    const { weekStart } = getWeekRange(weekQuery);
    const weekStartStr = formatKSTDate(weekStart);

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

    // MySQL에서 최신 summary 조회
    // const summary = await getLatestSummary(studentId);

    res.json({
      weakWord: {
        date: weekStartStr,
        categories: filteredWordCategories,
        summary_words: weekWeakWord ? weekWeakWord.summary_words : null,
      },
      weakNews: {
        date: weekStartStr,
        categories: filteredNewsCategories,
        // summary_news: summary.summary_news || null,
        summary_news: weekWeakNews ? weekWeakNews.summary_news : null,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};

// 부모가 자녀 약점 조회
exports.getStudentWeakness = async (req, res) => {
  const studentId = req.params.studentId;
  const weekQuery = req.query.week;

  try {
    const weakness = await DummyWeakness.findOne({ studentId: studentId });
    if (!weakness) return res.json({ weakWord: null, weakNews: null });

    function formatKSTDate(date) {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate()
      ).padStart(2, "0")}`;
    }

    const { weekStart } = getWeekRange(weekQuery);
    const weekStartStr = formatKSTDate(weekStart);

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

    // MySQL에서 최신 summary 조회
    const summary = await getLatestSummary(studentId);

    res.json({
      weakWord: {
        date: weekStartStr,
        categories: filteredWordCategories,
        summary_words: weekWeakWord ? weekWeakWord.summary_words : null,
      },
      weakNews: {
        date: weekStartStr,
        categories: filteredNewsCategories,
        // summary_news: summary.summary_news || null,
        summary_news: weekWeakNews ? weekWeakNews.summary_news : null,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};
