const { getStudentIdFromToken } = require("../auth/token");
const WordHistory = require("../models/wordHistory");
const { getWeekRange } = require("../utils/week");

exports.getWordHistory = async (req, res) => {
  const studentId = getStudentIdFromToken(req) || 123;
  const weekQuery = req.query.week;

  try {
    const wordData = await WordHistory.findOne({ studentId });
    if (!wordData) return res.status(404).json({ message: "해당 학생의 단어 데이터가 없습니다." });

    const { weekStart, weekEnd } = getWeekRange({ weekNumber: weekQuery });

    const filteredWord = wordData.words
      .filter((n) => {
        const wordDate = new Date(n.learningDate);
        return wordDate >= weekStart && wordDate <= weekEnd;
      })
      .sort((a, b) => new Date(a.learningDate) - new Date(b.learningDate));

    res.json({ words: filteredWord });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};
