const express = require("express");
const router = express.Router();
const { studentLogin, parentLogin } = require("../controllers/authController");

// 학생 로그인
router.post("/login/student", studentLogin);

// 학부모 로그인
router.post("/login/parent", parentLogin);

module.exports = router;
