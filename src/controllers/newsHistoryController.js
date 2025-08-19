const News = require("../models/NewsHistory");

exports.getNewsHistory = async (req, res) => {
  const { studentId } = req.params;

  try {
    const newsData = await News.findOne({ studentId: Number(studentId) });

    if (!newsData) {
      return res
        .status(404)
        .json({ message: "해당 학생의 뉴스 데이터가 없습니다." });
    }

    res.json({
      newsList: newsData.newsList,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};
