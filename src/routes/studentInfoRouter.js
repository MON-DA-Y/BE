const express = require("express");
const router = express.Router();
const { getStudentInfo } = require("../controllers/studentInfoController");

// 학생 정보 조회
router.get("/stdInfo", getStudentInfo);

module.exports = router;
