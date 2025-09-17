const express = require("express");
const router = express.Router();
const { getParentInfo } = require("../controllers/parentInfoController");

// 학부모 정보 조회
router.get("/prtInfo", getParentInfo);

module.exports = router;
