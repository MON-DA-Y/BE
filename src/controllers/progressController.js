const { getUserIdFromToken } = require("../utils/auth");
const Progress = require("../models/progress");
const { getWeekRange } = require("../utils/week");
const { ObjectId } = require("mongodb");

const DummyProgress = {
  findOne: async ({ studentId }) => {
    return {
      studentId,
      weekCompletionRate: 50,
      strikeDay: 2,
      days: [
        {
          day: "2025-09-16",
          tasks: {
            word: "done",
            news: "done",
            series: "ongoing",
            quiz: "done",
          },
        },
        {
          day: "2025-09-17",
          tasks: {
            word: "done",
            news: "pending",
            series: "pending",
            quiz: "done",
          },
        },
      ],
    };
  },
};

exports.getProgressByWeek = async (req, res) => {
  const studentId = getUserIdFromToken(req, "student");
  const weekQuery = req.query.week;

  try {
    const progress = await Progress.findOne({ studentId });
    if (!progress) return res.status(404).json({ message: "해당 학생의 진도 데이터가 없습니다." });

    const { weekStart, weekEnd } = getWeekRange(weekQuery);

    // 나중에 날짜 오류 나면 format 함수 넣기
    const progressInWeek = progress.days.filter((n) => {
      const progressDayStr = new Date(n.day).toISOString().split("T")[0];
      const weekStartStr = weekStart.toISOString().split("T")[0];
      const weekEndStr = weekEnd.toISOString().split("T")[0];

      console.log("checking day:", n.day, "progressDayStr:", progressDayStr);
      console.log("weekStartStr:", weekStartStr, "weekEndStr:", weekEndStr);

      const result = progressDayStr >= weekStartStr && progressDayStr <= weekEndStr;
      console.log("is in week?", result);
      return result;
    });

    console.log("progressInWeek:", progressInWeek);

    progressInWeek.sort((a, b) => new Date(a.day) - new Date(b.day));

    res.json({
      weekCompletionRate: progress.weekCompletionRate,
      strikeDay: progress.strikeDay,
      days: progressInWeek,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};

// 부모가 학생 진도 상황 조회
exports.getStudentProgress = async (req, res) => {
  const studentId = req.params.studentId;
  const weekQuery = req.query.week;

  try {
    const progress = await Progress.findOne({ studentId: studentId });

    const { weekStart, weekEnd } = getWeekRange(weekQuery);

    // 기본값
    let progressInWeek = [];
    let weekCompletionRate = 0;
    let strikeDay = 0;

    // 나중에 날짜 오류 나면 format 함수 넣기
    if (progress) {
      progressInWeek = progress.days.filter((n) => {
        const progressDayStr = new Date(n.day).toISOString().split("T")[0];
        const weekStartStr = weekStart.toISOString().split("T")[0];
        const weekEndStr = weekEnd.toISOString().split("T")[0];

        return progressDayStr >= weekStartStr && progressDayStr <= weekEndStr;
      });
      weekCompletionRate = progress.weekCompletionRate;
      strikeDay = progress.strikeDay;
    }

    progressInWeek.sort((a, b) => new Date(a.day) - new Date(b.day));

    res.json({
      weekCompletionRate,
      strikeDay,
      days: progressInWeek,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};
