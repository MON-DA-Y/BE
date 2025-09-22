const express = require("express");
const router = express.Router();
const { getProgressByWeek, getParentProgress } = require("../controllers/progressController");

router.get("/progress", getProgressByWeek);
router.get("/parent/progress", getParentProgress);

module.exports = router;
