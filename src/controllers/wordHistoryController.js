const { getUserIdFromToken } = require("../utils/auth");
const StudentWord = require("../models/studentWord");
const { getWeekRange } = require("../utils/week");
const Parent = require("../models/parent");

exports.getWordHistory = async (req, res) => {
  const studentId = getUserIdFromToken(req, "student");
  if (!studentId) return res.status(401).json({ message: "인증되지 않은 사용자입니다." });
  const weekQuery = req.query.week;

  try {
    const wordData = await StudentWord.findOne({ studentId });
    if (!wordData) return res.status(404).json({ message: "해당 학생의 단어 데이터가 없습니다." });

    const { weekStart, weekEnd } = getWeekRange(weekQuery);
    console.log("weekStart:", weekStart);
    console.log("weekEnd:", weekEnd);

    const wordHistory = (wordData.wordList || []).filter((r) => {
      console.log("각 항목 확인:", r);
      console.log("learningDate:", r.learningDate);
      const date = new Date(r.learningDate);
      return date >= weekStart && date <= weekEnd;
    });

    console.log("필터링 후 wordHistory:", wordHistory);

    res.json({ wordList: wordHistory });
  } catch (err) {
    console.error("getWordHistory 에러:", err);
    res.status(500).json({ message: "서버 오류" });
  }
};

exports.getParentWordHistory = async (req, res) => {
  const parentId = getUserIdFromToken(req, "parent");
  const weekQuery = req.query.week;

  try {
    const parent = await Parent.findById(parentId);
    if (!parent || !parent.studentIds || parent.studentIds.length === 0) {
      return res.status(404).json({ message: "자녀 정보가 없습니다." });
    }

    const { weekStart, weekEnd } = getWeekRange(weekQuery);
    console.log("weekStart:", weekStart);
    console.log("weekEnd:", weekEnd);

    // 모든 자녀의 단어 히스토리 조회
    const wordDataList = await StudentWord.find({
      studentId: { $in: parent.studentIds },
    });

    // 단어 배열 합치고 주차 필터링
    const wordHistory = wordDataList
      .flatMap((studentWord) => studentWord.wordList)
      .filter((r) => {
        const date = new Date(r.learningDate);
        return date >= weekStart && date <= weekEnd;
      });

    console.log("필터링 후 wordHistory:", wordHistory);

    res.json({ wordList: wordHistory });
  } catch (err) {
    console.error("getWordHistory 에러:", err);
    res.status(500).json({ message: "서버 오류" });
  }
};
