const StudentWord = require("../models/studentWord");
const StudentNews = require("../models/studentNews");
const { formatDate } = require("../utils/date");
const { getUserIdFromToken } = require("../utils/auth");

/// [GET] 오늘 학습률 조회
exports.getTodayLearningRate = async (req, res) => {
  try {
    const studentId = getUserIdFromToken(req, "student");
    if (!studentId)
      return res.status(401).json({ message: "인증되지 않은 사용자입니다." });

    const today = formatDate(new Date());

    // [ 단어 ]
    const studentWords = await StudentWord.findOne({ studentId }).lean();
    const todayWords =
      studentWords?.wordList?.filter(
        (w) => formatDate(w.assignedAt) === today
      ) || [];
    const learn_word = todayWords.filter((w) => w.understand).length;
    const today_word = todayWords.length;

    // [ 뉴스 ]
    const studentNews = await StudentNews.findOne({ studentId }).lean();
    const todayNews =
      studentNews?.newsList?.filter(
        (n) => formatDate(n.assignedAt) === today
      ) || [];
    const learn_news = todayNews.filter((n) => n.completed).length;
    const today_news = todayNews.length;

    // [ 시리즈 ] 💥 시리즈 구현 후 수정
    const learn_series = 0; // 시리즈 구현 전 기본 0
    const today_series = 2; // 기본 2

    res.json({
      result: {
        learn_word,
        today_word,
        learn_news,
        today_news,
        learn_series,
        today_series,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "오늘 학습률 조회 실패" });
  }
};

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

  // words 배열에서 필요한 필드만 뽑아서 response
  const responseWords = todayWords.words.map(({ word }) => word);

  res.json({
    result: responseWords,
  });
};

// [get] 학생 메인 monNews 조회
exports.getStdMonNews = (req, res) => {
  const studentId = getStudentIdFromToken(req) || 123; // 테스트용 디폴트
  const today = new Date().toISOString().split("T")[0];

  // 오늘 데이터 찾기
  const todayNews = dummyMonNews.find(
    (item) => item.studentId === studentId && item.createdAt === today
  );

  if (!todayNews) {
    return res.status(404).json({
      message: "오늘 뉴스가 아직 생성되지 않았습니다. 재접속 해주세요.",
    });
  }

  res.json({
    result: todayNews.title,
  });
};
