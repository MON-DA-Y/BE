const Parent = require("../models/parent");
const Student = require("../models/student");
const { getUserIdFromToken } = require("../utils/auth");

// [get] 학부모 정보 조회
exports.getParentInfo = async (req, res) => {
  const parentId = getUserIdFromToken(req, "parent"); // 테스트용 디폴트

  try {
    // DB에서 조회, 비밀번호 제외
    const parent = await Parent.findById(parentId).select("-password");
    if (!parent) return res.status(404).json({ message: "학생 정보가 없습니다." });

    const responsePrtInfo = {
      prt_name: parent.name,
      prt_email: parent.email,
      prt_phone: parent.phone,
    };

    res.json({ result: responsePrtInfo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};

// [POST] 학부모가 자녀 추가
exports.addStudent = async (req, res) => {
  const parentId = getUserIdFromToken(req, "parent");
  const { studentId } = req.body;

  if (!studentId) return res.status(400).json({ message: "studentId가 필요합니다." });

  try {
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "학생을 찾을 수 없습니다." });

    const updatedParent = await Parent.findByIdAndUpdate(
      parentId,
      { $addToSet: { studentIds: studentId } }, // 중복 방지
      { new: true }
    );
    if (!updatedParent) return res.status(404).json({ message: "학부모 정보를 찾을 수 없습니다." });

    // // 이미 추가되어 있는지 확인
    // if (parent.studentIds.includes(studentId))
    //   return res.status(400).json({ message: "이미 추가된 학생입니다." });

    res.json({ message: "자녀가 성공적으로 추가되었습니다.", student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "자녀 추가 실패" });
  }
};
