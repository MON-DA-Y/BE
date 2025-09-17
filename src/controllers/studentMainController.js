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
  const todayData = dummyMonWord.find(
    (item) => item.studentId === studentId && item.createdAt === today
  );

  if (!todayData) {
    return res.status(404).json({
      message: "오늘 단어가 아직 생성되지 않았습니다. 재접속 해주세요.",
    });
  }

  // words 배열에서 필요한 필드만 뽑아서 response
  const responseWords = todayData.words.map(({ word }) => word);

  res.json({
    result: responseWords,
  });
};
