const { getStudentIdFromToken } = require("../auth/token");
const NewsHistory = require("../models/newsHistory");

exports.getNewsHistory = async (req, res) => {
  const { studentId } = getStudentIdFromToken(req) || 123;

  try {
    const newsData = await NewsHistory.findOne({ studentId });

    if (!newsData) {
      return res.status(404).json({ message: "해당 학생의 뉴스 데이터가 없습니다." });
    }

    res.json({
      newsList: newsData.newsList,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};
