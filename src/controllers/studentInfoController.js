const Student = require("../models/student");
const { getUserIdFromToken } = require("../utils/auth");

// level 변환 함수
const getLevelLabel = (level) => {
  switch (level) {
    case 1:
      return "🥑 씨앗";
    case 2:
      return "🌱 새싹";
    case 3:
      return "🌿 잎새";
    case 4:
      return "🪵 가지";
    case 5:
      return "🌳 나무";
    case 6:
      return "🌼 꽃";
    case 7:
      return "🍎 열매";
    default:
      return "❓ 미정";
  }
};

// [get] 학생 정보 조회
exports.getStudentInfo = async (req, res) => {
  const studentId = getUserIdFromToken(req, "student"); // 테스트용 디폴트

  try {
    // DB에서 조회, 비밀번호 제외
    const student = await Student.findById(studentId).select("-password");
    if (!student) return res.status(404).json({ message: "학생 정보가 없습니다." });

    // 학생 레벨 (strikeDay 에 따른 )
    const studentLevel = getLevelLabel(student.level || 1);

    const responseStdInfo = {
      std_id: student.id,
      std_name: student.name,
      std_level: studentLevel,
      std_img: student.img || "",
      std_email: student.email,
      std_schoolType: student.schoolType,
      std_grade: student.grade,
      std_joinDate: student.createdAt.toISOString().split("T")[0] || null, // 가입일자
    };

    // console.log("responseStdInfo:", responseStdInfo);
    res.json({ result: responseStdInfo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};

exports.getStudentInfoById = async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await Student.findById(studentId).select("-password");
    if (!student) return res.status(404).json({ message: "학생 정보가 없습니다." });

    const responseStdInfo = {
      std_id: student.id,
      std_name: student.name,
      std_level: getLevelLabel(student.level || 1),
      std_img: student.img || "",
      std_email: student.email,
      std_schoolType: student.schoolType,
      std_grade: student.grade,
      std_joinDate: student.createdAt.toISOString().split("T")[0] || null,
    };

    res.json({ result: responseStdInfo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};

exports.getStudentByEmail = async (req, res) => {
  const { email } = req.query;
  try {
    const student = await Student.findOne({ email }).select("-password");
    if (!student) return res.status(404).json({ message: "학생을 찾을 수 없습니다." });

    res.json({
      std_name: student.name,
      std_level: student.level || "1",
      std_img: student.img || "",
      std_schoolType: student.schoolType,
      std_grade: student.grade,
      std_email: student.email,
      std_joinDate: student.createdAt.toISOString().split("T")[0] || null,
      _id: student._id, // 부모-자녀 연결용
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};
