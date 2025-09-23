const express = require("express");
const router = express.Router();
const logInController = require("../controllers/logInController");

// 로그인
router.post("/student", logInController.studentLogin);
router.post("/parent", logInController.parentLogin);

module.exports = router;
