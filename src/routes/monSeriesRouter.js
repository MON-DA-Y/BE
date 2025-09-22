const express = require("express");
const router = express.Router();
const {
  assignSeriesPartToStudent,
  getAllSeries,
} = require("../controllers/monSeriesController");

// 동기화된 시리즈 전체 조회
router.get("/", getAllSeries);

// monSeries 배정 (파트 학습 완료 시)
router.post("/assign", assignSeriesPartToStudent);

module.exports = router;
