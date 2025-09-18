const { getUserIdFromToken } = require("../utils/auth");
const NewsHistory = require("../models/NewsHistory");

// 테스트용 더미 데이터
const dummyMonNews = [
  {
    id: 1,
    studentId: 1,
    learningDate: new Date().toISOString().split("T")[0], // 항상 오늘로 설정
    title: "햄버거 값 또 올랐다! 인플레이션으로 물가 상승이 계속될까?",
    body: `"요즘 햄버거 가게에 가면 깜짝 놀라는 사람들이 많아요. 작년에는 5,500원이던 햄버거 세트가 올해는 6,500원이 되었기 때문이에요. 왜 이렇게 가격이 오르는 걸까요?\n\n이것은 바로 인플레이션 때문이에요. 인플레이션은 물건 값이 전반적으로 올라가는 현상을 말해요. 요즘은 고기, 빵, 채소 같은 재료 가격도 오르고, 직원들 월급도 올라서 음식점들이 가격을 올릴 수밖에 없어요.\n\n전문가들은 \"지금은 전 세계적으로 인플레이션이 계속되고 있어요. 물가가 안정될 때까지는 가격이 더 오를 수도 있어요.\"라고 말했어요.\n\n소비자들은 \"예전에는 같은 돈으로 더 많이 먹을 수 있었는데, 이제는 부담돼요.\"라며 걱정하고 있어요.\n\n여러분도 최근에 가격이 올라서 놀란 물건이 있나요? 🤔"`,
    summary: "최근 인플레이션 때문에 햄버거 값이 올라서 사람들이 부담을 느끼고 있어요",
    createdAt: new Date(),
  },
];

// [get] 오늘의 monNews 조회
exports.getTodayMonNews = (req, res) => {
  const studentId = getUserIdFromToken(req, "student") || 1;
  const today = new Date().toISOString().split("T")[0];

  const news = dummyMonNews.find(
    (item) => item.studentId === studentId && item.createdAt === today
  );

  if (!news) {
    return res.status(404).json({ message: "오늘 뉴스가 없습니다." });
  }

  res.json({
    result: {
      id: news.id,
      title: news.title,
      body: news.body,
      summary: news.summary,
    },
  });
};

// [post] 오늘의 monNews 완료
exports.postTodayMonNewsDone = async (req, res) => {
  try {
    const studentId = getStudentIdFromToken(req) || 1; // 테스트용 디폴트
    const today = new Date().toISOString().split("T")[0];
    const { newsId } = req.body;

    // 뉴스 히스토리에 학습 기록 추가
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

    // progress에 오늘 뉴스 완료 반영
    await Progress.updateOne(
      { studentId, "days.day": today },
      {
        $set: {
          "days.$.tasks.news": "done",
        },
      },
      { upsert: true }
    );
    await Progress.updateWeekCompletion(studentId, today);

    // console.log(`학생 ${studentId}의 ${today} 뉴스 학습 완료!`);
    res.json({ message: "오늘 MON 뉴스 학습 완료!", learningDate: today });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "뉴스 학습 완료 처리 실패" });
  }
};
