const mongoose = require("mongoose");

const weaknessSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  weakWord: [
    {
      date: { type: Date, required: true }, // 해당 주의 시작일
      categories: [
        {
          category: { type: String, required: true },
          total: { type: Number, required: true },
          correct: { type: Number, required: true },
        },
      ],
      summary: { type: String, default: null },
    },
  ],
  weakNews: [
    {
      date: { type: Date, required: true }, // 해당 주의 시작일
      categories: [
        {
          category: { type: String, required: true },
          total: { type: Number, required: true },
          correct: { type: Number, required: true },
        },
      ],
      summary: { type: String, default: null },
    },
  ],
});

module.exports = mongoose.model("Weakness", weaknessSchema);
