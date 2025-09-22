const mongoose = require("mongoose");

const QuizItemSchema = new mongoose.Schema({
  mqiId: { type: Number, required: true }, // MySQL monQuiz item id
  question: { type: String, required: true },
  choices: { type: [String], required: true },
  answer: { type: String }, // 정답
  marking: { type: String, default: "" },
  source: { type: String, enum: ["word", "news"], required: true },
  position: { type: Number },
});

const DailyQuizSchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD
  mqId: { type: Number, required: true }, // monQuiz.mq_id
  mnId: { type: Number, required: true }, // monNews.mn_id
  level: { type: String },
  category: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  quizList: [QuizItemSchema],
});

// 오늘 날짜 + mqId 유니크
DailyQuizSchema.index({ date: 1, mqId: 1 }, { unique: true });

module.exports = mongoose.model("DailyQuiz", DailyQuizSchema);
