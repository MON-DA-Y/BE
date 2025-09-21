const jwt = require("jsonwebtoken");
const DailyWord = require("../models/daily/dailyWord");
const StudentWord = require("../models/studentWord");
const Student = require("../models/student");
const { formatDate } = require("../utils/date");
const { getUserIdFromToken } = require("../utils/auth");

// [POST] 학생에게 오늘 단어 배정 (level)
exports.assignWordToStudent = async (req, res) => {
  try {
    const studentId = getUserIdFromToken(req, "student");

    if (!studentId)
      return res.status(401).json({ message: "인증되지 않은 사용자입니다." });

    // studentId로 DB에서 회원 조회 (비밀번호 제외)
    const studentInfo = await Student.fineById(studentId).select("-password");
    if (!studentInfo)
      return res.status(404).json({ message: "학생 정보가 없습니다." });

    // 회원의 level 값 (없으면 1로 기본 세팅)
    const level = studentInfo.level || "씨앗";
    const dateStr = formatDate(new Date());

    // 오늘 날짜 + 해당 레벨 뉴스 가져오기
    const docs = await DailyWord.find({ date: dateStr, level }).lean();

    if (!docs.length) {
      return res
        .status(404)
        .json({ message: `${dateStr}의 ${level} 레벨의 단어가 없습니다.` });
    }

    let student = await StudentWord.findOne({ studentId });
    if (!student) {
      const wordList = docs.map((d) => ({
        mwId: d.mwiId,
        word: d.word,
        meaning: d.meaning,
        practice: d.practice,
        understand: d.understand,
        completed: false,
        learningDate: null,
        assignedAt: new Date(), // 오늘 날짜 추가
      }));
      student = await StudentWord.create({ studentId, wordList });
      return res.json({
        message: "오늘 단어가 배정되었습니다.",
        count: wordList.length,
      });
    }

    // 이미 저장된 단어와 비교 → 중복 제거
    const existIds = new Set(student.wordList.map((n) => n.mwiId));
    const newItems = docs
      .filter((d) => !existIds.has(d.mwiId))
      .map((d) => ({
        mwId: d.mwiId,
        word: d.word,
        meaning: d.meaning,
        practice: d.practice,
        understand: d.understand,
        completed: false,
        learningDate: null,
        assignedAt: new Date(), // 오늘 날짜
      }));

    if (newItems.length) {
      student.wordList.push(...newItems);
      await student.save();
    }

    res.json({
      message: "오늘 단어가 배정되었습니다.",
      added: newItems.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "뉴스 배정 실패" });
  }
};

// [GET] 오늘의 monWord 조회
exports.getTodayMonWord = async (req, res) => {
  try {
    const studentId = getUserIdFromToken(req, "student");
    if (!studentId)
      return res.status(401).json({ message: "인증되지 않은 사용자입니다." });

    const today = formatDate(new Date());

    // 1) 학생이 이미 할당받은 단어 있는지 조회
    let studentWords = await StudentWord.findOne({ studentId }).lean();

    if (!studentWords) {
      const dailyWords = await DailyWord.find({ date: today }).lean();
      if (!dailyWords.length)
        return res.status(404).json({ message: "오늘 단어가 없습니다." });

      // 3) 학생Word 생성
      const wordList = dailyWords.flatMap((dw) =>
        dw.words.map((w) => ({
          mwiId: w.mwiId,
          word: w.word,
          meaning: w.meaning,
          practice: w.practice,
          position: w.position,
          understand: false,
          assignedAt: new Date(),
        }))
      );

      const created = await StudentWord.create({ studentId, wordList });
      studentWords = created.toObject();
    }

    res.json({
      result: studentWords.wordList.map((w) => ({
        id: w.mwiId,
        word: w.word,
        explain: w.meaning,
        use: w.practice,
        understand: w.understand,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "오늘 단어 조회 실패" });
  }
};

// 단어 이해 완료 처리
exports.postWordItemUnderstand = async (req, res) => {
  try {
    const studentId = getUserIdFromToken(req);
    if (!studentId) return res.status(401).json({ message: "인증 필요" });

    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "단어 ID 필요" });

    const result = await StudentWord.updateOne(
      { studentId, "wordList.mwiId": id },
      {
        $set: {
          "wordList.$.understand": true,
        },
      }
    );

    if (result.modifiedCount === 0)
      return res.status(404).json({ message: "단어를 찾을 수 없습니다." });

    res.json({ message: "단어 학습 완료!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "단어 학습 처리 실패" });
  }
};

// 오늘 단어 학습 완료 처리
exports.postTodayMonWordDone = async (req, res) => {
  try {
    const studentId = getUserIdFromToken(req);
    if (!studentId) return res.status(401).json({ message: "인증 필요" });

    const studentWords = await StudentWord.findOne({ studentId });
    if (!studentWords)
      return res.status(404).json({ message: "오늘 단어가 없습니다." });

    const allUnderstood = studentWords.wordList.every((w) => w.understand);
    if (!allUnderstood)
      return res.status(400).json({ message: "모든 단어를 학습해주세요." });

    const result = await StudentWord.updateOne(
      { studentId, "wordList.mwiId": id },
      {
        $set: {
          "wordList.$.completed": true,
          "wordList.$.learningDate": new Date(),
        },
      }
    );

    if (result.modifiedCount === 0)
      return res.status(404).json({ message: "단어를 찾을 수 없습니다." });

    res.json({ message: "오늘 Mon 단어 학습 완료!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "오늘 단어 완료 처리 실패" });
  }
};
