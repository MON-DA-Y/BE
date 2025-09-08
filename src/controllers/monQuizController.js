const jwt = require("jsonwebtoken");

// 테스트용 더미 데이터
const dummyMonQuiz = [
  {
    studentId: 123,
    createdAt: new Date().toISOString().split("T")[0], // 오늘 날짜
    learningDate: new Date(),
    quizzes: [
      {
        id: 1,
        type: "word",
        question: "인플레이션은 무엇인가요?",
        choices: ["물가 상승", "물가 하락", "경제 안정"],
        answer: "물가 상승",
        selectedAnswer: "물가 상승",
        isCorrect: true,
        marking:
          "물가가 오르는 게 인플레이션이에요! 용돈으로 살 수 있는 과자 수가 줄어드는 거죠.",
      },
      {
        id: 2,
        type: "news",
        question: "디플레이션의 특징은 무엇인가요?",
        choices: ["물가 상승", "물가 하락", "경제 성장"],
        answer: "물가 하락",
        selectedAnswer: "경제 성장",
        isCorrect: false,
        marking:
          "물가가 내려가는 게 디플레이션이에요! 용돈으로 살 수 있는 과자 수가 많아져요.",
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

// [get] 오늘의 monQuiz 조회
exports.getTodayMonQuiz = (req, res) => {
  const studentId = getStudentIdFromToken(req) || 123; // 테스트용 디폴트
  const today = new Date().toISOString().split("T")[0];

  // 오늘 데이터 찾기
  const todayData = dummyMonQuiz.find(
    (item) => item.studentId === studentId && item.createdAt === today
  );

  if (!todayData) {
    return res.status(404).json({ message: "오늘 퀴즈가 없습니다." });
  }

  // quizzes 배열에서 필요한 필드만 뽑아서 response
  const responseQuizzes = todayData.quizzes.map(
    ({ id, type, question, choices }) => ({
      id,
      type,
      question,
      choices,
    })
  );

  res.json({
    result: responseQuizzes,
  });
};

// [post] 오늘의 MonQuiz 제출
exports.postMonQuizSubmit = (req, res) => {
  const studentId = getStudentIdFromToken(req) || 123; // 테스트용 디폴트
  const today = new Date().toISOString().split("T")[0];

  // 오늘 데이터 찾기
  const todayData = dummyMonQuiz.find(
    (item) => item.studentId === studentId && item.createdAt === today
  );

  if (!todayData) {
    return res.status(404).json({ message: "오늘 퀴즈가 없습니다." });
  }

  const { selectedAnswers } = req.body;

  if (!selectedAnswers || Object.keys(selectedAnswers).length === 0) {
    return res.status(400).json({ message: "선택한 답이 없습니다." });
  }

  // 선택한 답을 todayData에 반영
  todayData.quizzes.forEach((quiz) => {
    const selected = selectedAnswers[quiz.id];
    if (selected) {
      quiz.selectedAnswer = selected;
      quiz.isCorrect = quiz.answer === selected;
    }
  });

  res.json({
    message: "오늘 Mon 퀴즈 제출 완료!",
    result: todayData.quizzes.map(
      ({ id, isCorrect, selectedAnswer, marking }) => ({
        id,
        isCorrect,
        selectedAnswer,
        marking,
      })
    ),
  });
};
