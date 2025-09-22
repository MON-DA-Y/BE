const StudentWord = require("../models/studentWord");
const StudentNews = require("../models/studentNews");
const { Series, SeriesKeyword } = require("../models/syncSeries");
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

// [GET] 학생 메인 monSeries 조회 (동기화된 전체에서 2개 랜덤/순서)
exports.getStdMonSeries = async (req, res) => {
  try {
    // 동기화된 전체 시리즈 및 키워드 조회
    const seriesList = await Series.find().lean();
    const keywords = await SeriesKeyword.find().lean();

    // 랜덤으로 섞기
    const shuffled = seriesList.sort(() => 0.5 - Math.random());

    // 시리즈에서 키워드(mainKeyword) 매칭
    const result = shuffled.map((s) => {
      const keywordObj = keywords.find((kw) => kw.kwId === s.kwId);
      return {
        id: s.msId,
        keyword: keywordObj ? keywordObj.mainKeyword : "",
        title: s.title,
        sub_title: s.subtitle || "",
        parts: [],
      };
    });

    res.json({ result: result });
  } catch (err) {
    console.error("getStdMonSeries 에러:", err);
    res.status(500).json({ message: "오늘 시리즈 조회 실패" });
  }
};
