const mongoose = require("mongoose");

const SeriesKeywordSchema = new mongoose.Schema({
  kwId: { type: Number, required: true, unique: true },
  mainKeyword: String,
  inputAt: Date,
  updateAt: Date,
});

const SeriesArticleWordItemSchema = new mongoose.Schema({
  msaWiId: { type: Number, required: true, unique: true },
  word: String,
  meaning: String,
});

const SeriesArticleSchema = new mongoose.Schema({
  msaId: { type: Number, required: true, unique: true },
  msId: Number,
  oaId: String,
  title: String,
  subtitle: String,
  main: String,
  summary: String,
  practice: String,
  wordItems: [SeriesArticleWordItemSchema],
});

const SeriesSchema = new mongoose.Schema({
  msId: { type: Number, required: true, unique: true },
  kwId: Number,
  title: String,
  subtitle: String,
  articles: [SeriesArticleSchema],
  firstImageUrl: String,
  inputAt: Date,
  updateAt: Date,
});

const SeriesKeyword = mongoose.model("SeriesKeyword", SeriesKeywordSchema);
const Series = mongoose.model("Series", SeriesSchema);

module.exports = { SeriesKeyword, Series };
