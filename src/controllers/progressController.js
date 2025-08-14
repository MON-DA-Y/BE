//진도 더미데이터
const dummyProgress = {
  // studentId
  1: {
    // week
    3: {
      weekCompletionRate: 80,
      strikeDay: 3,
      days: [
        {
          day: "2025-07-31",
          tasks: {
            word: "done",
            news: "done",
            series: "done",
            quiz: "done",
          },
        },
        {
          day: "2025-08-01",
          tasks: {
            word: "done",
            news: "done",
            series: "ongoing",
            quiz: "pending",
          },
        },
        {
          day: "2025-08-02",
          tasks: {
            word: "done",
            news: "ongoing",
            series: "pending",
            quiz: "pending",
          },
        },
      ],
    },
  },
  2: {
    3: {
      weekCompletionRate: 50,
      strikeDay: 1,
      days: [
        {
          day: "2025-04-14",
          tasks: {
            word: "done",
            news: "done",
            series: "ongoing",
            quiz: "pending",
          },
        },
      ],
    },
  },
};

exports.getProgressByWeek = (req, res) => {
  const { studentId } = req.params;
  const { week } = req.query;

  if (!week) {
    return res.status(400).json({ message: "해당 주차를 선택해주세요." });
  }

  const progress = dummyProgress[studentId]?.[week];

  if (!progress) {
    return res.status(404).json({ message: "해당 데이터가 없습니다." });
  }

  res.json({
    week: parseInt(week, 10),
    weekCompletionRate: progress.weekCompletionRate,
    strikeDay: progress.strikeDay,
    days: progress.days,
  });
};
