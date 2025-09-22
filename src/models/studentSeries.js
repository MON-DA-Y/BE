const mongoose = require("mongoose");

// 파트
const StudentSeriesArticleSchema = new mongoose.Schema({
  msaId: Number,
  title: String,
  subtitle: String,
  main: String,
  summary: String,
  practice: String,
  wordItems: [{ word: String, meaning: String }],
});

// 시리즈
const StudentSeriesSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  msId: Number,
  title: String,
  subtitle: String,
  articles: [StudentSeriesArticleSchema],
  assignedAt: { type: Date, default: Date.now },
});

const StudentSeries = mongoose.model("StudentSeries", StudentSeriesSchema);
module.exports = StudentSeries;
