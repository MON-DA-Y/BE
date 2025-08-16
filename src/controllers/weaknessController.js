//약점 더미데이터
const dummyWeakness = {
  // studentId
  1: {
    // week
    3: {
      weakWord: {
        categories: [
          { category: "MONEY", total: 10, correct: 6 },
          { category: "GLOBAL", total: 8, correct: 6 },
          { category: "TECH", total: 6, correct: 6 },
          { category: "RULES", total: 4, correct: 4 },
        ],
        summary:
          "이번 주는 금리와 국제 이슈 관련 문제에서 오답률이 높았어요. 특히 개념을 실제 사례와 연결하는 부분에서 어려움을 겪었고, 관련 용어나 정책 이해도를 더 높이면 도움이 될 것 같아요.",
      },
      weakNews: {
        categories: [
          { category: "RULES", total: 8, correct: 3 },
          { category: "BIGPICTURE", total: 9, correct: 5 },
        ],
        summary: null,
      },
    },
  },
};

exports.getWeaknessByWeek = (req, res) => {
  const { studentId } = req.params;
  const { week } = req.query;

  if (!week) {
    return res.status(400).json({ message: "해당 주차를 선택해주세요." });
  }

  const weakness = dummyWeakness[studentId]?.[week];

  if (!weakness) {
    return res.status(404).json({ message: "해당 데이터가 없습니다." });
  }

  res.json({
    week: parseInt(week, 10),
    weakWord: weakness.weakWord,
    weakNews: weakness.weakNews,
  });
};
