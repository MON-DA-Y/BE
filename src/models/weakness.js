const mongoose = require("mongoose");

const weaknessSchema = new mongoose.Schema({
  studentId: { type: Number, required: true },
  weakWord: [
    {
      week: { type: Number, required: true },
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
