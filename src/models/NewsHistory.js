const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  studentId: { type: Number, required: true },
  newsList: [
    {
      newsId: { type: String, required: true },
      category: { type: String, required: true },
      title: { type: String, required: true },
      imgUrl: { type: String, default: null },
      learningDate: { type: Date, required: true },
      isCorrect: { type: Boolean, required: true },
    },
  ],
});

module.exports = mongoose.model("NewsHistory", newsSchema);
