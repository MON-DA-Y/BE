const mongoose = require("mongoose");

const studentWordSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
    index: true,
  },
  wordList: [
    {
      mwiId: { type: Number, required: true }, // DailyWord.words.mwiId
      category: { type: String },
      word: { type: String, required: true },
      meaning: { type: String, required: true },
      practice: { type: String },
      understand: { type: Boolean, default: false }, // 이해했어요 여부
      assignedAt: { type: Date, default: Date.now }, // 학생에게 할당된 시각
      learningDate: { type: Date, default: null }, // 학생이 실제로 학습한 시각
      completed: { type: Boolean, default: false }, // 학습완료 여부
    },
  ],
});

// studentId + mwiId 유니크
studentWordSchema.index({ studentId: 1, "wordList.mwiId": 1 });

module.exports = mongoose.model("StudentWord", studentWordSchema);
