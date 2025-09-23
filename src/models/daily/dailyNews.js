// (오늘자 + 레벨 기준으로 저장되는 컬렉션)

const mongoose = require("mongoose");

const dailyNewsSchema = new mongoose.Schema(
  {
    mnId: { type: Number, required: true }, // mon_news 고유 id
    oaId: { type: String }, // 원문 기사 id
    category: { type: String },
    level: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String },
    summary: { type: String },
    imgUrl: { type: String, default: null },
    inputAt: { type: Date }, // AI DB의 input_at
    date: { type: String, required: true }, // YYYY-MM-DD (오늘자)
  },
  { timestamps: true }
);

dailyNewsSchema.index({ date: 1, level: 1, mnId: 1 }, { unique: true });

module.exports = mongoose.model("DailyNews", dailyNewsSchema);
