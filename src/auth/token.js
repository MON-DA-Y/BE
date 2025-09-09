const jwt = require("jsonwebtoken");

// 토큰에서 studentId 추출
const getStudentIdFromToken = (req) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return 1; // 테스트용 임시 studentId

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dummy_secret"); // 테스트용
    return decoded.studentId;
  } catch (err) {
    return 1; // 테스트용 임시 studentId
  }
};

module.exports = { getStudentIdFromToken };
