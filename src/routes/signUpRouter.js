const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// 회원가입
router.post("/signup/student", authController.studentSignUp);
router.post("/signup/parent", authController.parentSignUp);

module.exports = router;
