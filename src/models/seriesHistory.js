const mongoose = require("mongoose");

const seriesSchema = new mongoose.Schema({
  studentId: { type: Number, required: true },
  seriesList: [
    {
      seriesId: { type: String, required: true },
      title: { type: String, required: true },
      sub_title: { type: String, required: true },
      keyword: { type: String, required: true },
      status: { type: String, required: true },
      totalCount: { type: Number, required: true },
      learnedCount: { type: Number, required: true },
      imgUrl: { type: String, required: true },
      parts: [
        {
          partId: { type: String, required: true },
          isLearned: { type: Boolean, required: true },
          part_title: { type: String, required: true },
          part_sub_title: { type: String, required: true },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("SeriesHistory", seriesSchema);
