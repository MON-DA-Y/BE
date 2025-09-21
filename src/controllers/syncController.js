const { syncDailyNewsForDate } = require("../services/syncService");
const { formatDate } = require("../utils/date");

exports.syncDailyNews = async (req, res) => {
  try {
    const date = req.body.date || formatDate(new Date());
    console.log("Sync date:", date);
    const result = await syncDailyNewsForDate(date);
    console.log(result);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "뉴스 동기화 실패" });
  }
};

exports.syncDailyWords = async (req, res) => {
  try {
    const date = req.body.date || formatDate(new Date());
    const result = await syncDailyWordsForDate(date);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "단어 동기화 실패" });
  }
};
