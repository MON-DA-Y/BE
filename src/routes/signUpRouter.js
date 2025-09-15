const express = require("express");
const router = express.Router();
const signUpController = require("../controllers/signUpController");

// 회원가입
router.post("/signup/student", signUpController.studentSignUp);
router.post("/signup/parent", signUpController.parentSignUp);

module.exports = router;
