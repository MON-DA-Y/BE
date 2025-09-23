const express = require("express");
const router = express.Router();
const {
  getParentInfo,
  addStudent,
} = require("../controllers/parentInfoController");

// 학부모 정보 조회
router.get("/", getParentInfo);

// 학생 추가
router.post("/add-student", addStudent);

module.exports = router;
