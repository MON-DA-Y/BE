const { getStudentIdFromToken } = require("../auth/token");
const Weakness = require("../models/weakness");

exports.getWeaknessByWeek = async (req, res) => {
  const studentId = getStudentIdFromToken(req) || 123;
  const weekQuery = parse(req.query.week);

  try {
    const weakness = await Weakness.findOne({ studentId });
    if (!weakness)
      return res.status(404).json({ message: "해당 학생의 약점 분석 데이터가 없습니다." });

    const weaknessInWeek = weakness.weakWord.filter((w) => w.week === weekQuery);

    res.json({ weakness: weaknessInWeek });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};
