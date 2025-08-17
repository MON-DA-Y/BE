//퀴즈 성적 더미데이터
const dummyQuizResults = {
  // studentId
  1: {
    // week
    3: {
      results: [
        {
          quizId: 101,
          day: "2025-07-31",
          score: 85,
        },
        {
          quizId: 102,
          day: "2025-08-01",
          score: 70,
        },
        {
          quizId: 103,
          day: "2025-08-02",
          score: 90,
        },
      ],
    },
  },
};

exports.getQuizResultByWeek = (req, res) => {
  const { studentId } = req.params;
  const { week } = req.query;

  if (!week) {
    return res.status(400).json({ message: "해당 주차를 선택해주세요." });
  }

  const quizResult = dummyQuizResults[studentId]?.[week];

  if (!quizResult) {
    return res.status(404).json({ message: "퀴즈 데이터가 없습니다." });
  }

  res.json({
    week: parseInt(week, 10),
    results: quizResult.results,
  });
};
