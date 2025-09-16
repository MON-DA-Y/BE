const mongoose = require("mongoose");

const newsHistorySchema = new mongoose.Schema({
  studentId: { type: Number, required: true },
  newsList: [
    {
      newsId: { type: Number, required: true },
      category: { type: String, default: null },
      title: { type: String, required: true },
      imgUrl: { type: String, default: null },
      learningDate: { type: Date, required: true },
      isCorrect: { type: Boolean, default: null },
    },
  ],
});

module.exports = mongoose.model("NewsHistory", newsHistorySchema);
