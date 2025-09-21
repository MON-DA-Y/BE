const jwt = require("jsonwebtoken");
const StudentWord = require("../models/studentWord");
const StudentNews = require("../models/studentNews");
const { formatDate } = require("../utils/date");
const { getUserIdFromToken } = require("../utils/auth");

// [GET] 학생 메인 monWord 조회
exports.getStdMonWord = async (req, res) => {
  try {
    const studentId = getUserIdFromToken(req, "student");
    if (!studentId)
      return res.status(401).json({ message: "인증되지 않은 사용자입니다." });

    const today = formatDate(new Date());

    // 학생 단어 데이터 조회
    const studentWords = await StudentWord.findOne({ studentId }).lean();
    if (!studentWords || !studentWords.wordList.length) {
      return res.status(404).json({ message: "오늘 단어가 없습니다." });
    }

    // 오늘 배정된 단어만 필터링
    const todayWords = studentWords.wordList.filter(
      (w) => formatDate(w.assignedAt) === today
    );

    if (!todayWords.length) {
      return res.status(404).json({ message: "오늘 단어가 없습니다." });
    }

    // 응답 데이터 가공
    const responseWords = todayWords.map((w) => ({
      id: w.mwiId,
      word: w.word,
    }));

    res.json({
      result: responseWords,
    });
  } catch (err) {
    console.error("getStdMonWord 에러:", err);
    res.status(500).json({ message: "오늘 단어 조회 실패" });
  }
};

// [GET] 학생 메인 monNews 조회
exports.getStdMonNews = async (req, res) => {
  try {
    const studentId = getUserIdFromToken(req);
    if (!studentId) {
      return res.status(401).json({ message: "인증되지 않은 사용자입니다." });
    }

    const today = formatDate(new Date());

    // 학생 뉴스 조회
    const student = await StudentNews.findOne({ studentId }).lean();
    if (!student) {
      return res.status(404).json({ message: "오늘 뉴스가 없습니다." });
    }

    // 오늘 할당된 뉴스만 필터링
    const todayNews = student.newsList.filter(
      (item) => formatDate(item.assignedAt) === today
    );

    if (!todayNews.length) {
      return res.status(404).json({ message: "오늘 뉴스가 없습니다." });
    }

    // 학생 메인에서는 뉴스 제목만 내려줌
    res.json({
      result: todayNews[0].title,
    });
  } catch (err) {
    console.error("getStdMonNews 에러:", err);
    res.status(500).json({ message: "오늘 뉴스 조회 실패" });
  }
};
