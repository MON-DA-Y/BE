const jwt = require("jsonwebtoken");

const getUserIdFromToken = (req, type = "student") => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return 1; // 테스트용

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dummy_secret");
    return type === "student" ? decoded.studentId : decoded.parentId;
  } catch {
    return 1; // 테스트용
  }
};

module.exports = { getUserIdFromToken };
