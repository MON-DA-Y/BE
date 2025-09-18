// CLI로 실행 가능한 동기화 스크립트 (cron에서 호출)
require("dotenv").config();
const connectMongoose = require("../config/db");
const { syncDailyNewsForDate } = require("../services/syncService");
const { formatDate } = require("../utils/date");

(async () => {
  await connectMongoose();
  const today = formatDate(new Date()); // 'YYYY-MM-DD'
  const result = await syncDailyNewsForDate(today);
  console.log("Daily sync done", result);
  process.exit(0);
})();
