const { getStudentIdFromToken } = require("../auth/token");
//const WordHistory = require("../models/wordHistory");
const { getWeekRange } = require("../utils/week");

const DummyWordHistory = {
  findOne: async ({ studentId }) => {
    return {
      studentId,
      words: [
        {
          wordId: 1,
          category: "MONEY",
          word: "제목",
          explain: "설명",
          use: "써먹기",
          learningDate: "2025-09-05",
          isCorrect: true,
        },
      ],
    };
  },
};

exports.getWordHistory = async (req, res) => {
  const studentId = getStudentIdFromToken(req) || 1;
  const weekQuery = req.query.week;

  try {
    const wordData = await DummyWordHistory.findOne({ studentId });
    if (!wordData) return res.status(404).json({ message: "해당 학생의 단어 데이터가 없습니다." });

    function formatKSTDate(date) {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
        date.getDate()
      ).padStart(2, "0")}`;
    }

    const { weekStart, weekEnd } = getWeekRange(weekQuery);
    const startStr = formatKSTDate(weekStart);
    const endStr = formatKSTDate(weekEnd);

    const wordHistory = wordData.words.filter((r) => {
      return r.learningDate >= startStr && r.learningDate <= endStr;
    });

    res.json({ words: wordHistory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};
