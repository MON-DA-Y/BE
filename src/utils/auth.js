const jwt = require("jsonwebtoken");

const getUserIdFromToken = (req, type = "student") => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dummy_secret");
    return type === "student" ? decoded.studentId : decoded.parentId;
  } catch (err) {
    console.error("JWT 검증 실패:", err.message);
    return null;
  }
};

module.exports = { getUserIdFromToken };
