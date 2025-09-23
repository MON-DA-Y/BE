const { getUserIdFromToken } = require("../utils/auth");
const Progress = require("../models/progress");
const { getWeekRange } = require("../utils/week");
const Parent = require("../models/parent");

exports.getProgressByWeek = async (req, res) => {
  const studentId = getUserIdFromToken(req, "student");
  const weekQuery = req.query.week;

  try {
    const progress = await Progress.findOne({ studentId });
    if (!progress) {
      return res.json({
        weekCompletionRate: 0,
        strikeDay: 0,
        days: [],
      });
    }

    const { weekStart, weekEnd } = getWeekRange(weekQuery);

    // 나중에 날짜 오류 나면 format 함수 넣기
    const progressInWeek = progress.days.filter((n) => {
      const progressDayStr = new Date(n.day).toISOString().split("T")[0];
      const weekStartStr = weekStart.toISOString().split("T")[0];
      const weekEndStr = weekEnd.toISOString().split("T")[0];
      const result = progressDayStr >= weekStartStr && progressDayStr <= weekEndStr;
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
exports.getParentProgress = async (req, res) => {
  const parentId = getUserIdFromToken(req, "parent");
  const weekQuery = req.query.week;

  try {
    const parent = await Parent.findById(parentId);
    if (!parent || !parent.studentIds || parent.studentIds.length === 0) {
      return res.status(404).json({ message: "자녀 정보가 없습니다." });
    }

    const studentId = parent.studentIds[0]; // 학생 한 명만 있다고 가정
    const { weekStart, weekEnd } = getWeekRange(weekQuery);

    const progress = await Progress.findOne({ studentId });
    if (!progress) {
      return res.json({
        weekCompletionRate: 0,
        strikeDay: 0,
        days: [],
      });
    }

    const progressInWeek = progress.days.filter((n) => {
      const progressDayStr = new Date(n.day).toISOString().split("T")[0];
      const weekStartStr = weekStart.toISOString().split("T")[0];
      const weekEndStr = weekEnd.toISOString().split("T")[0];
      return progressDayStr >= weekStartStr && progressDayStr <= weekEndStr;
    });

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
