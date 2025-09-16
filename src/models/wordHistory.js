const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema({
  studentId: { type: Number, required: true },
  words: [
    {
      wordId: { type: Number, required: true },
      category: { type: String, required: true },
      word: { type: String, required: true },
      explain: { type: String, required: true },
      use: { type: String, required: true },
      learningDate: { type: Date, required: true },
      isCorrect: { type: Boolean, default: null },
    },
  ],
});

module.exports = mongoose.model("WordHistory", wordSchema);
