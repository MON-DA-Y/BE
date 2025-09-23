const express = require("express");
const router = express.Router();
const {
  getStudentInfo,
  getStudentInfoById,
  getStudentByEmail,
} = require("../controllers/studentInfoController");

// 학생 정보 조회
router.get("/", getStudentInfo);
// 학부모 페이지에서 학생 조회
router.get("/:studentId", getStudentInfoById);
// 학생 - 학부모 연결
router.get("/student/email", getStudentByEmail);

module.exports = router;
