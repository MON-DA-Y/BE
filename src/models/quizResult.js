const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema({
  studentId: { type: Number, required: true },
  results: [
    {
      quizId: { type: String, required: true },
      day: { type: Date, required: true },
      score: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("QuizResult", quizResultSchema);
