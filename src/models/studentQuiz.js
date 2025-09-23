const mongoose = require("mongoose");

const studentQuizSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
    index: true,
  },
  category: { type: String },
  score: { type: Number, default: 0 }, // 퍼센트 점수
  quizList: [
    {
      quizId: { type: Number, required: true },
      type: { type: String, enum: ["단어", "뉴스"], required: true },
      question: { type: String, required: true },
      choices: { type: [String], default: [] },
      answer: { type: String, required: true }, // 정답
      selectedAnswer: { type: String, default: null }, // 학생 선택
      isCorrect: { type: Boolean, default: false },
      marking: { type: String, default: "" },
      assignedAt: { type: Date, default: Date.now }, // 학생에게 할당된 시각
      submit: { type: Boolean, default: false },
      submitDate: { type: Date, default: null },
    },
  ],
});

// studentId + createdAt 인덱스 (중복 방지용)
studentQuizSchema.index({ studentId: 1, createdAt: 1 }, { unique: true });

module.exports = mongoose.model("StudentQuiz", studentQuizSchema);
