const mongoose = require("mongoose");

const wordItemSchema = new mongoose.Schema(
  {
    mwiId: { type: Number, required: true, index: true }, // monWord item의 고유 id
    word: { type: String, required: true },
    meaning: { type: String, required: true },
    practice: { type: String },
    position: { type: Number },
  },
  { _id: false }
);

const dailyWordSchema = new mongoose.Schema({
  date: { type: String, required: true, index: true }, // YYYY-MM-DD
  mnId: { type: Number, required: true, unique: true }, // mn_id (monNews id) 외래키
  oaId: { type: String }, // 원문 기사 id
  level: { type: String },
  inputAt: { type: Date, required: true },
  words: [wordItemSchema], // monWord item 리스트
});

dailyWordSchema.index({ mnId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("DailyWord", dailyWordSchema);
