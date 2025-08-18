//단어 더미데이터
const dummyWord = {
  // studentId
  1: {
    // week
    3: {
      words: [
        {
          wordId: 101,
          category: "MONEY",
          word: "인플레이션",
          explain: "물가가 전반적으로 오르는 현상",
          use: "인플레이션 때문에 커피 값이 3천 원에서 5천 원으로 올랐다.",
          isCorrect: false,
        },
        {
          wordId: 102,
          category: "MONEY",
          word: "디플레이션",
          explain: "물가가 전반적으로 내려가는 현상",
          use: "경기 침체로 디플레이션이 발생해 물가가 계속 떨어지고 있다.",
          isCorrect: true,
        },
        {
          wordId: 103,
          category: "GLOBAL",
          word: "경상수지",
          explain: "한 나라의 수출입, 투자 수익 등을 포함한 경제 거래의 수지",
          use: "한국의 경상수지가 흑자를 기록하며 경제가 안정세를 보였다.",
          isCorrect: true,
        },
        {
          wordId: 104,
          category: "BIGPICTURE",
          word: "GDP",
          explain: "한 나라 안에서 일정 기간 동안 생산된 재화와 서비스의 총액",
          use: "올해 한국의 GDP는 2조 달러를 돌파했다.",
          isCorrect: false,
        },
        {
          wordId: 106,
          category: "MONEY",
          word: "환율",
          explain: "한 나라의 돈을 다른 나라의 돈으로 바꾸는 비율",
          use: "환율이 급등하면서 해외여행 비용이 크게 늘어났다.",
          isCorrect: true,
        },
      ],
    },
  },
};

exports.getWordByWeek = (req, res) => {
  const { studentId } = req.params;
  const { week } = req.query;

  if (!week) {
    return res.status(400).json({ message: "해당 주차를 선택해주세요." });
  }

  const word = dummyWord[studentId]?.[week];

  if (!word) {
    return res.status(404).json({ message: "해당 데이터가 없습니다." });
  }

  res.json({
    week: parseInt(week, 10),
    words: word.words,
  });
};
