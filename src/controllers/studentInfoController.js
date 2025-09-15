const { response } = require("express");
const jwt = require("jsonwebtoken");

// 테스트용 더미 데이터
const dummyStudent = [
  {
    std_id: 123,
    std_name: "마수민",
    std_level: 1,
    std_img:
      "https://i.pinimg.com/736x/00/01/dc/0001dc013a9fdaaf3c67cf8818c58b58.jpg",
  },
  {
    std_id: 1234,
    std_name: "유동은",
    std_level: 2,
    std_img:
      "https://i.pinimg.com/736x/b3/6d/d2/b36dd260dc6d22466fc1707ecbd12268.jpg",
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
const getStudentIdFromToken = (req) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.studentId;
  } catch (err) {
    console.error(err);
  }
};

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
exports.getStudentInfo = (req, res) => {
  const studentId = getStudentIdFromToken(req) || 123; // 테스트용 디폴트

  // 학생 정보 데이터 찾기
  const studentInfo = dummyStudent.find(
    (student) => student.std_id === studentId
  );

  if (!studentInfo) {
    return res.status(404).json({ message: "학생 정보가 없습니다." });
  }

  const responseStdInfo = {
    std_name: studentInfo.std_name,
    std_level: getLevelLabel(studentInfo.std_level),
    std_img: studentInfo.std_img,
  };

  res.json({
    result: responseStdInfo,
  });
};
