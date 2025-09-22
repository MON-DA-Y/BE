// // node-cron 스케줄 등록 (매일 00:00)
// const cron = require("node-cron");
// const {
//   syncDailyNewsForDate,
//   syncDailyWordsForDate,
// } = require("../services/syncService");
// const { formatDate } = require("../utils/date");

// // 매일 00:00에 뉴스/단어/퀴즈 동기화 실행
// cron.schedule("0 0 * * *", async () => {
//   const today = formatDate(new Date());
//   console.log(`[${today}] Daily sync 시작...`);

//   try {
//     const newsRes = await syncDailyNewsForDate(today);
//     console.log(`[${today}] 뉴스 동기화 완료:`, newsRes);

//     const wordsRes = await syncDailyWordsForDate(today);
//     console.log(`[${today}] 단어 동기화 완료:`, wordsRes);
//   } catch (err) {
//     console.error(`[${today}] Daily sync 실패:`, err);
//   }
// });

// console.log("Daily sync cron 등록 완료");

// 테스트용 (오늘 데이터 가져오기)
const {
  syncDailyNewsForDate,
  syncDailyWordsForDate,
  syncDailyQuizForDate,
} = require("../services/syncService");
const { formatDate } = require("../utils/date");

const today = formatDate(new Date());
syncDailyNewsForDate(today)
  .then((res) => console.log(`${today} 뉴스 동기화 완료:`, res))
  .catch((err) => console.error(err));

syncDailyWordsForDate(today)
  .then((res) => console.log(`${today} 단어 동기화 완료:`, res))
  .catch((err) => console.error(err));

syncDailyQuizForDate(today)
  .then((res) => console.log(`${today} 퀴즈 동기화 완료:`, res))
  .catch((err) => console.error(err));
// // 테스트용 (2025-09-17 >> 원하는 날짜 가져오기)
// const { syncDailyNewsForDate } = require("../services/syncService");

// async function test() {
//   const dateStr = "2025-09-19"; // 테스트용 날짜
//   const result = await syncDailyNewsForDate(dateStr);
//   console.log("동기화 결과:", result);
// }

// test();
