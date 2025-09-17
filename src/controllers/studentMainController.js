const { response } = require("express");
const jwt = require("jsonwebtoken");

// 테스트용 더미 데이터
// monWord
const dummyMonWord = [
  {
    studentId: 123,
    createdAt: new Date().toISOString().split("T")[0], // 오늘 날짜
    learningDate: new Date(),
    words: [
      {
        id: 1,
        understand: false,
        word: "인플레이션",
        explain:
          "인플레이션은 물건 값(물가)이 전반적으로 오르는 현상이에요. 같은 돈으로 살 수 있는 게 점점 줄어드는 것과 같아요.",
        use: "아니 작년에 500원이던 과자가 이제 800원이라고? 이거 완전 인플레이션이네!",
      },
      {
        id: 2,
        understand: false,
        word: "디플레이션",
        explain:
          "디플레이션은 물건 값(물가)이 전반적으로 내려가는 현상이에요. 돈의 가치가 상대적으로 올라가요.",
        use: "요즘 물가가 계속 떨어진대. 이거 디플레이션이야.",
      },
    ],
  },
];

// monNews
const dummyMonNews = [
  {
    id: 1,
    studentId: 123,
    learningDate: new Date().toISOString().split("T")[0], // 항상 오늘로 설정
    title: "햄버거 값 또 올랐다! 인플레이션으로 물가 상승이 계속될까?",
    body: `"요즘 햄버거 가게에 가면 깜짝 놀라는 사람들이 많아요. 작년에는 5,500원이던 햄버거 세트가 올해는 6,500원이 되었기 때문이에요. 왜 이렇게 가격이 오르는 걸까요?\n\n이것은 바로 인플레이션 때문이에요. 인플레이션은 물건 값이 전반적으로 올라가는 현상을 말해요. 요즘은 고기, 빵, 채소 같은 재료 가격도 오르고, 직원들 월급도 올라서 음식점들이 가격을 올릴 수밖에 없어요.\n\n전문가들은 \"지금은 전 세계적으로 인플레이션이 계속되고 있어요. 물가가 안정될 때까지는 가격이 더 오를 수도 있어요.\"라고 말했어요.\n\n소비자들은 \"예전에는 같은 돈으로 더 많이 먹을 수 있었는데, 이제는 부담돼요.\"라며 걱정하고 있어요.\n\n여러분도 최근에 가격이 올라서 놀란 물건이 있나요? 🤔"`,
    summary:
      "최근 인플레이션 때문에 햄버거 값이 올라서 사람들이 부담을 느끼고 있어요",
    createdAt: new Date().toISOString().split("T")[0],
  },
];

// 토큰에서 studentId 추출
const getStudentIdFromToken = (req) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.studentId;
  } catch (err) {
    console.error(err);
  }
};

// [get] 학생 메인 monWord 조회
exports.getStdMonWord = (req, res) => {
  const studentId = getStudentIdFromToken(req) || 123; // 테스트용 디폴트
  const today = new Date().toISOString().split("T")[0];

  // 오늘 데이터 찾기
  const todayWords = dummyMonWord.find(
    (item) => item.studentId === studentId && item.createdAt === today
  );

  if (!todayWords) {
    return res.status(404).json({
      message: "오늘 단어가 아직 생성되지 않았습니다. 재접속 해주세요.",
    });
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
