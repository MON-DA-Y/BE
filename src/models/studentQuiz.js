const mongoose = require("mongoose");

const studentQuizSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: () => new Date().setHours(0, 0, 0, 0), // 하루 단위로 관리
    index: true,
  },
  category: { type: String },
  submit: { type: Boolean, default: false },
  submitDate: { type: Date, default: null },
  score: { type: Number, default: 0 }, // 퍼센트 점수
  quizzes: [
    {
      quizId: { type: Number, required: true },
      type: { type: String, enum: ["word", "news"], required: true },
      question: { type: String, required: true },
      choices: { type: [String], default: [] },
      answer: { type: String, required: true }, // 정답
      selectedAnswer: { type: String, default: null }, // 학생 선택
      isCorrect: { type: Boolean, default: false },
      marking: { type: String, default: "" },
    },
  ],
});

// studentId + createdAt 인덱스 (중복 방지용)
studentQuizSchema.index({ studentId: 1, createdAt: 1 }, { unique: true });

module.exports = mongoose.model("StudentQuiz", studentQuizSchema);
