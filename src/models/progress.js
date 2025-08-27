const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  studentId: { type: Number, required: true },
  weekCompletionRate: { type: Number, required: true },
  strikeDays: { type: Number, required: true },
  days: [
    {
      day: { type: Date, required: true },
      tasks: [
        {
          word: { type: String, enum: ["done", "ongoing", "pending"], required: true },
          news: { type: String, enum: ["done", "ongoing", "pending"], required: true },
          series: { type: String, enum: ["done", "ongoing", "pending"], required: true },
          quiz: { type: String, enum: ["done", "ongoing", "pending"], required: true },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Progress", progressSchema);
