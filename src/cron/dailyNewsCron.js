// // node-cron 스케줄 등록 (매일 00:00)
// const cron = require("node-cron");
// const { exec } = require("child_process");

// cron.schedule("0 0 * * *", () => {
//   console.log("Run daily sync at 00:00");
//   exec("node ./src/scripts/syncDaily.js", (err, stdout, stderr) => {
//     if (err) console.error(err);
//     console.log(stdout);
//   });
// });

// 테스트용 (오늘 데이터 가져오기)
const { syncDailyNewsForDate } = require("../services/syncService");
const { formatDate } = require("../utils/date");

syncDailyNewsForDate(formatDate(new Date()))
  .then((res) => console.log("동기화 완료:", res))
  .catch((err) => console.error(err));

// // 테스트용 (2025-09-17 >> 원하는 날짜 가져오기)
// const { syncDailyNewsForDate } = require("../services/syncService");

// async function test() {
//   const dateStr = "2025-09-19"; // 테스트용 날짜
//   const result = await syncDailyNewsForDate(dateStr);
//   console.log("동기화 결과:", result);
// }

// test();
