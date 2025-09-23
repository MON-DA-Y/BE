const express = require("express");
const router = express.Router();
const signUpController = require("../controllers/signUpController");

// 회원가입
router.post("/student", signUpController.studentSignUp);
router.post("/parent", signUpController.parentSignUp);

module.exports = router;
