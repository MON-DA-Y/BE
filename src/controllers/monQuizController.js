//const jwt = require("jsonwebtoken");
const { getUserIdFromToken } = require("../utils/auth");
const QuizResult = require("../models/quizResult");

// 테스트용 더미 데이터
const dummyMonQuiz = [
  {
    studentId: 123,
    createdAt: new Date().toISOString().split("T")[0], // 오늘 날짜
    submitDate: new Date(), // 제출 후
    submit: false, // 제출 후
    quizzes: [
      {
        id: 1,
        type: "word",
        question: "인플레이션은 무엇인가요?",
        choices: ["물가 상승", "물가 하락", "경제 안정"],
        answer: "물가 상승",
        selectedAnswer: "물가 상승",
        isCorrect: true,
        marking: "물가가 오르는 게 인플레이션이에요! 용돈으로 살 수 있는 과자 수가 줄어드는 거죠.",
      },
      {
        id: 2,
        type: "news",
        question: "디플레이션의 특징은 무엇인가요?",
        choices: ["물가 상승", "물가 하락", "경제 성장"],
        answer: "물가 하락",
        selectedAnswer: "경제 성장",
        isCorrect: false,
        marking: "물가가 내려가는 게 디플레이션이에요! 용돈으로 살 수 있는 과자 수가 많아져요.",
      },
    ],
  },
];

// mon_quiz_id로 category 가져오기
const getCategoryByQuiz = async (mq_id) => {
  const result = await MonQuiz.aggregate([
    { $match: { mq_id } }, // mon_quiz에서 mq_id
    {
      $lookup: {
        from: "mon_news", // mon_news
        localField: "mn_id",
        foreignField: "mn_id",
        as: "news",
      },
    },
    { $unwind: "$news" },
    {
      $lookup: {
        from: "org_article_tb", // org_article_tb
        localField: "news.oa_id",
        foreignField: "oa_id",
        as: "article",
      },
    },
    { $unwind: "$article" },
    { $project: { category: "$article.category", _id: 0 } },
  ]);

  if (!result.length) throw new Error("Category not found");

  return result[0].category;
};

// [get] 오늘의 monQuiz 조회
exports.getTodayMonQuiz = (req, res) => {
  const studentId = getUserIdFromToken(req, "student");
  const today = new Date().toISOString().split("T")[0];

  // 오늘 데이터 찾기
  const todayData = dummyMonQuiz.find(
    (item) => item.studentId === studentId && item.createdAt === today
  );

  if (!todayData) {
    return res.status(404).json({
      message: "오늘의 퀴즈가 아직 생성되지 않았습니다. 다시 접속해주세요.",
    });
  }

  // quizzes 배열에서 필요한 필드만 뽑아서 response
  const responseQuizzes = todayData.quizzes.map(({ id, type, question, choices }) => ({
    id,
    type,
    question,
    choices,
  }));

  res.json({
    result: responseQuizzes,
  });
};

// [post] 오늘의 MonQuiz 제출
exports.postMonQuizSubmit = async (req, res) => {
  const studentId = getUserIdFromToken(req, "student");
  const today = new Date().toISOString().split("T")[0];

  // 오늘 데이터 찾기
  const todayData = dummyMonQuiz.find(
    (item) => item.studentId === studentId && item.createdAt === today
  );

  if (!todayData) {
    return res.status(404).json({
      message: "오늘의 퀴즈가 아직 생성되지 않았습니다. 다시 접속해주세요.",
    });
  }

  const { selectedChoices } = req.body;

  if (!selectedChoices || Object.keys(selectedChoices).length === 0) {
    return res.status(400).json({ message: "선택한 답이 없습니다." });
  }

  // 선택한 답을 todayData에 반영
  todayData.quizzes.forEach((quiz) => {
    const selected = selectedChoices[quiz.id];
    if (selected) {
      quiz.selectedAnswer = selected;
      quiz.isCorrect = quiz.answer === selected;
      quiz.answer = selected;
    }
  });

  // 틀린 퀴즈 id 추출
  const wrongQuizIds = todayData.quizzes.filter((quiz) => !quiz.isCorrect).map((quiz) => quiz.id);

  // 다른 서버로 전송
  // try {
  //   await axios.post(`${서버url}/wrong-quizzes`, {
  //     studentId,
  //     wrongQuizIds,
  //     submittedAt: new Date(),
  //   });
  //   console.log("틀린 퀴즈 id 전송 완료:", wrongQuizIds);
  // } catch (err) {
  //   console.error("틀린 퀴즈 전송 실패:", err.message);
  // }

  // 제출 상태 업데이트
  todayData.submit = true;
  todayData.submitDate = new Date();

  // score 계산
  const totalQuizzes = todayData.quizzes.length;
  const correctCount = todayData.quizzes.filter((q) => q.isCorrect).length;
  const percentageScore = Math.round((correctCount / totalQuizzes) * 100);

  // quizResult 컬렉션에 저장
  await QuizResult.updateOne(
    { studentId },
    {
      $push: {
        results: todayData.quizzes.map((quiz) => ({
          quizId: quiz.id,
          day: today,
          score: percentageScore,
        })),
      },
    },
    { upsert: true }
  );

  // weakness 컬렉션에 저장
  const { weekEnd } = getWeekRange("이번주");
  const nextDay = new Date(weekEnd);
  nextDay.setDate(nextDay.getDate() + 1);

  const category = await getCategoryByQuiz(mq_id);

  await Weakness.updateOne(
    { studentId },
    {
      $push: {
        weakWord: {
          date: nextDay,
          categories: {
            category,
            total: totalQuizzes,
            correct: correctCount,
          },
          summary: null,
        },
        weakNews: {
          date: nextDay,
          categories: {
            category,
            total: totalQuizzes,
            correct: correctCount,
          },
          summary: null,
        },
      },
    },
    { upsert: true }
  );

  // progress에 오늘 퀴즈 완료 반영
  await Progress.updateOne(
    { studentId, "days.day": today },
    {
      $set: {
        "days.$.tasks.quiz": "done",
      },
    },
    { upsert: true }
  );
  await Progress.updateStrikeDay(studentId, today);

  res.json({
    message: "오늘 Mon 퀴즈 제출 완료!",
    result: todayData.quizzes.map(({ id, isCorrect, selectedAnswer, marking, answer }) => ({
      id,
      answer,
      isCorrect,
      selectedAnswer,
      marking,
    })),
    submit: todayData.submit,
    submitDate: todayData.submitDate,
  });
};

// [get] 오늘의 monQuiz 채점 조회
exports.getTodayMonQuizMark = (req, res) => {
  const studentId = getUserIdFromToken(req, "student");
  const today = new Date().toISOString().split("T")[0];

  // 오늘 데이터 찾기
  const todayData = dummyMonQuiz.find(
    (item) => item.studentId === studentId && item.createdAt === today
  );

  if (!todayData) {
    return res.status(404).json({
      message: "오늘의 퀴즈가 아직 생성되지 않았습니다. 다시 접속해주세요.",
    });
  }

  if (!todayData.submit) {
    return res.status(404).json({ message: "퀴즈를 제출하지 않았습니다." });
  }

  // quizzes 배열에서 필요한 필드만 뽑아서 response
  const responseQuizMarks = todayData.quizzes.map(
    ({ id, type, question, selectedAnswer, answer, choices, marking, isCorrect }) => ({
      id,
      type,
      question,
      choices,
      answer,
      selectedAnswer,
      isCorrect,
      marking,
    })
  );

  res.json({
    result: responseQuizMarks,
  });
};

// [post] 오늘의 monQuiz 채점 학습/확인 완료
exports.postTodayMonQuizMarkDone = (req, res) => {
  const studentId = getUserIdFromToken(req, "student");
  const today = new Date().toISOString().split("T")[0];

  // 오늘 데이터 찾기
  const todayData = dummyMonQuiz.find(
    (item) => item.studentId === studentId && item.createdAt === today
  );

  if (!todayData) {
    return res.status(404).json({
      message: "오늘의 퀴즈가 아직 생성되지 않았습니다. 다시 접속해주세요.",
    });
  }

  if (!todayData.submit) {
    return res.status(404).json({ message: "퀴즈를 제출하지 않았습니다." });
  }

  // 학습 완료 처리
  res.json({ message: "오늘 Mon 퀴즈 채점 확인 완료!" });
};

// [get] 학생이 제출했는지 여부
exports.getStudentSubmit = (req, res) => {
  const studentId = getUserIdFromToken(req, "student");
  const today = new Date().toISOString().split("T")[0];

  // 오늘 데이터 찾기
  const todayData = dummyMonQuiz.find(
    (item) => item.studentId === studentId && item.createdAt === today
  );

  if (!todayData) {
    return res.status(404).json({
      message: "오늘의 퀴즈가 아직 생성되지 않았습니다. 다시 접속해주세요.",
    });
  }

  if (todayData.submit) {
    return res.json({
      submit: true,
      message: "오늘 Mon 퀴즈 채점 확인 완료!",
    });
  } else {
    return res.json({
      submit: false,
      message: "퀴즈를 제출하지 않았습니다.",
    });
  }
};
