const { getUserIdFromToken } = require("../utils/auth");
const StudentNews = require("../models/studentNews");
const { getWeekRange } = require("../utils/week");
const Parent = require("../models/parent");

// 뉴스 히스토리 조회
exports.getNewsHistory = async (req, res) => {
  const studentId = getUserIdFromToken(req, "student");
  const weekQuery = req.query.week;

  try {
    const newsData = await StudentNews.findOne({ studentId });
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

// 부모가 자녀 뉴스 히스토리 조회
exports.getParentNewsHistory = async (req, res) => {
  const parentId = getUserIdFromToken(req, "parent");
  const weekQuery = req.query.week;

  try {
    const parent = await Parent.findById(parentId);
    if (!parent || !parent.studentIds || parent.studentIds.length === 0) {
      return res.status(404).json({ message: "자녀 정보가 없습니다." });
    }

    const { weekStart, weekEnd } = getWeekRange(weekQuery);

    // 모든 자녀 뉴스 조회
    const newsList = await StudentNews.find({
      studentId: { $in: parent.studentIds },
    });

    // 뉴스 배열 합치고 주차 필터링
    const newsHistory = newsList
      .flatMap((studentNews) => studentNews.newsList)
      .filter((r) => {
        const date = new Date(r.learningDate);
        return date >= weekStart && date <= weekEnd;
      });

    res.json({ newsList: newsHistory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};
