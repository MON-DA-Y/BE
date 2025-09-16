const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema({
  studentId: { type: Number, required: true },
  results: [
    {
      quizId: { type: Number, required: true },
      day: { type: Date, required: true },
      score: { type: Number, default: null },
    },
  ],
});

module.exports = mongoose.model("QuizResult", quizResultSchema);
