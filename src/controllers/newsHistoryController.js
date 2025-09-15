const { getUserIdFromToken } = require("../utils/auth");
const NewsHistory = require("../models/newsHistory");
const { getWeekRange } = require("../utils/week");

// DB 저장
exports.postNewsHistory = async (req, res) => {
  const studentId = Number(getUserIdFromToken(req, "student"));
  const { newsId, title, imgUrl, category } = req.body;
  const today = new Date().toISOString().split("T")[0];

  try {
    await NewsHistory.updateOne(
      { studentId },
      {
        $push: {
          newsList: {
            newsId,
            title,
            imgUrl,
            category,
            learningDate: today,
            isCorrect: null,
          },
        },
      },
      { upsert: true }
    );

    res.json({ message: "뉴스 학습 기록 추가 완료!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "뉴스 기록 추가 실패" });
  }
};

// 뉴스 히스토리 조회
exports.getNewsHistory = async (req, res) => {
  const studentId = Number(getUserIdFromToken(req, "student"));
  const weekQuery = req.query.week;

  try {
    const newsData = await NewsHistory.findOne({ studentId });
    if (!newsData) return res.status(404).json({ message: "해당 학생의 뉴스 데이터가 없습니다." });

    const { weekStart, weekEnd } = getWeekRange(weekQuery);

    const newsHistory = newsData.newsList.filter((r) => {
      const date = new Date(r.learningDate);
      return date >= weekStart && date <= weekEnd;
    });

    res.json({ newsList: newsHistory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};
