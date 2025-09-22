const DailyNews = require("../models/daily/dailyNews");
const StudentNews = require("../models/studentNews");
const Student = require("../models/student");
const { formatDate } = require("../utils/date");
const { getUserIdFromToken } = require("../utils/auth");
const { getLevelLabel } = require("../utils/level");
const Progress = require("../models/progress");

// [POST] 학생에게 오늘 뉴스 배정 (level)
exports.assignNewsToStudent = async (req, res) => {
  try {
    const studentId = getUserIdFromToken(req, "student");

    if (!studentId)
      return res.status(401).json({ message: "인증되지 않은 사용자입니다." });

    // studentId로 DB에서 회원 조회 (비밀번호 제외)
    const studentInfo = await Student.findById(studentId).select("-password");
    if (!studentInfo)
      return res.status(404).json({ message: "학생 정보가 없습니다." });

    // 회원의 level 값 (없으면 1로 기본 세팅)
    const level = getLevelLabel(studentInfo.level);
    const today = formatDate(new Date());

    // ① 오늘 날짜 + 해당 레벨 뉴스 가져오기
    const docs = await DailyNews.find({ date: today, level }).lean();

    // ② 테스트용 - 가장 최신 날짜 / 해당 레벨 1개 가져오기
    // const docs = await DailyNews.find({ level, date: today })
    //   .sort({
    //     date: -1,
    //   })
    //   .lean();

    if (!docs.length) {
      return res
        .status(404)
        .json({ message: `${today}의 ${level} 레벨의 뉴스가 없습니다.` });
    }

    let student = await StudentNews.findOne({ studentId });
    if (!student) {
      const newsList = docs.map((d) => ({
        mnId: d.mnId,
        category: d.category,
        level: d.level,
        title: d.title,
        body: d.body,
        summary: d.summary,
        imgUrl: d.imgUrl,
        completed: false,
        learningDate: null,
        assignedAt: new Date(), // 오늘 날짜 추가
      }));
      student = await StudentNews.create({ studentId, newsList });
      return res.json({
        message: "오늘 뉴스가 배정되었습니다.",
        count: newsList.length,
      });
    }

    // 이미 저장된 뉴스와 비교 → 중복 제거
    const existIds = new Set(
      student.newsList
        .filter((n) => formatDate(n.assignedAt) === today)
        .map((n) => n.mnId)
    );
    const newItems = docs
      .filter((d) => !existIds.has(d.mnId))
      .map((d) => ({
        mnId: d.mnId,
        category: d.category,
        level: d.level,
        title: d.title,
        body: d.body,
        summary: d.summary,
        imgUrl: d.imgUrl,
        completed: false,
        learningDate: null,
        assignedAt: new Date(), // 오늘 날짜
      }));

    if (newItems.length) {
      student.newsList.push(...newItems);
      await student.save();
    }

    res.json({
      message: "오늘 뉴스가 배정되었습니다.",
      added: newItems.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "뉴스 배정 실패" });
  }
};

// [GET] 오늘의 monNews 조회
exports.getTodayMonNews = async (req, res) => {
  try {
    const studentId = getUserIdFromToken(req, "student") || 1;
    const today = formatDate(new Date());

    if (!studentId)
      return res.status(401).json({ message: "인증되지 않은 사용자입니다." });

    // 1) 학생이 이미 할당받은 단어 있는지 조회
    const student = await StudentNews.findOne({ studentId }).lean();
    if (!student)
      return res.status(404).json({ message: "오늘 뉴스가 없습니다." });

    const todayNews = student.newsList.filter(
      (item) => formatDate(item.assignedAt) === today
    );

    if (!todayNews.length)
      return res.status(404).json({ message: "오늘 뉴스가 없습니다." });

    res.json({
      result: todayNews.map((news) => ({
        id: news.mnId,
        title: news.title,
        body: news.body,
        summary: news.summary,
        imgUrl: news.imgUrl,
        level: news.level,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "오늘 뉴스 조회 실패" });
  }
};

// [POST] 오늘의 monNews 완료 처리
exports.postTodayMonNewsDone = async (req, res) => {
  try {
    const studentId = getUserIdFromToken(req, "student") || 1;
    const { newsId } = req.body;
    const today = formatDate(new Date());

    const result = await StudentNews.updateOne(
      { studentId, "newsList.mnId": newsId },
      {
        $set: {
          "newsList.$.completed": true,
          "newsList.$.learningDate": new Date(),
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "뉴스를 찾을 수 없습니다." });
    }

    // progress에 오늘 뉴스 완료 반영
    let progress = await Progress.findOne({ studentId });
    if (!progress) {
      // 없으면 새로 생성
      progress = await Progress.create({
        studentId,
        days: [{ day: today, tasks: { news: "done" } }],
      });
    } else {
      // 오늘 날짜 데이터 확인
      let todayData = progress.days.find((d) => formatDate(d.day) === today);
      if (!todayData) {
        todayData = { day: today, tasks: { news: "done" } };
        progress.days.push(todayData);
      } else {
        todayData.tasks.news = "done";
      }
      await progress.save();
    }
    // strikeDay 및 weekCompletionRate 갱신
    await Progress.updateStrikeDay(studentId, today);
    await Progress.updateWeekCompletionRate(studentId);

    res.json({ message: "오늘 MON 뉴스 학습 완료!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "뉴스 학습 완료 처리 실패" });
  }
};
