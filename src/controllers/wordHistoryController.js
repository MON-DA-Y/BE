const { getStudentIdFromToken } = require("../auth/token");
const WordHistory = require("../models/wordHistory");

exports.getWordHistory = async (req, res) => {
  const { studentId } = getStudentIdFromToken(req) || 123;

  try {
    const wordData = await WordHistory.findOne({ studentId });

    if (!wordData) {
      return res.status(404).json({ message: "해당 학생의 단어 데이터가 없습니다." });
    }

    res.json({
      words: wordData.words,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};
