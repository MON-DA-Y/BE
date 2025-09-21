// const { response } = require("express");
// const jwt = require("jsonwebtoken");
const Student = require("../models/student");
const { getUserIdFromToken } = require("../utils/auth");

// 테스트용 더미 데이터
const dummyStudent = [
  {
    std_id: 123,
    std_name: "마수민",
    std_level: 1,
    std_img: "https://i.pinimg.com/736x/00/01/dc/0001dc013a9fdaaf3c67cf8818c58b58.jpg",
  },
  {
    std_id: 1234,
    std_name: "유동은",
    std_level: 2,
    std_img: "https://i.pinimg.com/736x/b3/6d/d2/b36dd260dc6d22466fc1707ecbd12268.jpg",
  },
  {
    std_id: 12345,
    std_name: "이혜원",
    std_level: 3,
    std_img:
      "https://scontent-icn2-1.cdninstagram.com/v/t51.2885-19/435029293_389578433959902_1449522984405615672_n.jpg?efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-icn2-1.cdninstagram.com&_nc_cat=106&_nc_oc=Q6cZ2QFTqtW2O_Bs5iexQnC_5HMrf0mX4WQGBL0pKSy92fhFAl7mzp6ys7IXUR6F5GQut9Y&_nc_ohc=5mK7-aTvshUQ7kNvwFJnxF9&_nc_gid=b83J52tIrxXyBceMdzXzaw&edm=AP4sbd4BAAAA&ccb=7-5&oh=00_Afb1jDbzmxGK_xbCwK16Ka8aLe9NCdeaqVDMgCJK15l8-g&oe=68CD5C2F&_nc_sid=7a9f4b",
  },
];

// 토큰에서 studentId 추출
// const getStudentIdFromToken = (req) => {
//   const authHeader = req.headers["authorization"];
//   if (!authHeader) return null;

//   const token = authHeader.split(" ")[1];
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     return decoded.studentId;
//   } catch (err) {
//     console.error(err);
//   }
// };

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

// strikeDay -> level 변환
const getLevelByStrike = (strikeDay) => {
  if (strikeDay >= 700) return 7;
  if (strikeDay >= 365) return 6;
  if (strikeDay >= 200) return 5;
  if (strikeDay >= 100) return 4;
  if (strikeDay >= 66) return 3;
  if (strikeDay >= 21) return 2;
  return 1;
};

// [get] 학생 정보 조회
exports.getStudentInfo = async (req, res) => {
  const studentId = getUserIdFromToken(req, "student"); // 테스트용 디폴트

  try {
    // DB에서 조회, 비밀번호 제외
    const student = await Student.findById(studentId).select("-password");
    if (!student) return res.status(404).json({ message: "학생 정보가 없습니다." });

    const responseStdInfo = {
      std_id: student.id,
      std_name: student.name,
      std_level: getLevelLabel(getLevelByStrike(student.level || 1)),
      std_img: student.img || "",
      std_email: student.email,
      std_schoolType: student.schoolType,
      std_grade: student.grade,
      std_joinDate: student.createdAt.toISOString().split("T")[0], // 가입일자
    };

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
      std_joinDate: student.createdAt.toISOString().split("T")[0],
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
      std_joinDate: student.createdAt.toISOString().split("T")[0],
      _id: student._id, // 부모-자녀 연결용
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};
