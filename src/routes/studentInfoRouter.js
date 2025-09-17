const express = require("express");
const router = express.Router();
const { getStudentInfo, getStudentByEmail } = require("../controllers/studentInfoController");

// 학생 정보 조회
router.get("/stdInfo", getStudentInfo);
// 학생 - 학부모 연결
router.get("/student/email", getStudentByEmail);

module.exports = router;
