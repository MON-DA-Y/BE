const jwt = require("jsonwebtoken");

const getUserIdFromToken = (req, type = "student") => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    // 토큰 없음 → 인증 실패
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not set in environment variables");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (type === "student") return decoded.studentId || null;
    if (type === "parent") return decoded.parentId || null;
    return null;
  } catch (err) {
    console.error("JWT 검증 실패:", err.message);
    return null; // 잘못된 토큰이면 null 반환
  }
};

module.exports = { getUserIdFromToken };
