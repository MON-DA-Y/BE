const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  studentId: { type: Number, required: true },
  weekCompletionRate: { type: Number, required: true, default: 0 },
  days: [
    {
      day: { type: Date, required: true },
      tasks: {
        word: { type: String, enum: ["done", "pending"], default: "pending" },
        news: { type: String, enum: ["done", "pending"], default: "pending" },
        series: { type: String, enum: ["done", "ongoing", "pending"], default: "pending" },
        quiz: { type: String, enum: ["done", "pending"], default: "pending" },
      },
    },
  ],
});

// 다 완료하면 weekCompletionRate +1
progressSchema.statics.updateWeekCompletion = async function (studentId, today) {
  const progress = await this.findOne({ studentId });
  if (!progress) return;

  const todayData = progress.days.find((d) => d.day.toISOString().split("T")[0] === today);
  if (!todayData) return;

  const { word, news, series, quiz } = todayData.tasks;
  if (word === "done" && news === "done" && series === "done" && quiz === "done") {
    await this.updateOne({ studentId }, { $inc: { weekCompletionRate: 1 } });
  }
};

module.exports = mongoose.model("Progress", progressSchema);
