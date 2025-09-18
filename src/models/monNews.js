const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  newsList: [
    {
      newsId: { type: Number, required: true },
      learningDate: { type: Date, required: true },
      title: { type: String, required: true },
      imgUrl: { type: String, default: null },
      body: { type: String, default: null },
      summary: { type: String, default: null },
      createdAt: { type: Date, default: null },
    },
  ],
});

module.exports = mongoose.model("News", newsSchema);
