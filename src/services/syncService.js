// AI DB(MySQL) → MongoDB 동기화 로직
const mysqlPool = require("../config/mysql");
const DailyNews = require("../models/daily/dailyNews");

async function syncDailyNewsForDate(dateStr) {
  const conn = await mysqlPool.getConnection();
  try {
    // MySQL 쿼리: 오늘자 데이터만 가져오기 (대략 예시)
    const [rows] = await conn.execute(
      `
        SELECT m.mn_id AS mnId, m.oa_id AS oaId, m.level, m.title, m.main AS body,
            m.summary, m.input_at, o.img_url AS imgUrl
        FROM mon_news m
        LEFT JOIN org_article_tb o ON m.oa_id = o.oa_id
        WHERE DATE(m.input_at) = ?
    `,
      [dateStr]
    );

    if (!rows.length) return { inserted: 0 };

    // bulkWrite로 upsert (date+level+mnId 유니크 보장)
    const ops = rows.map((row) => ({
      updateOne: {
        filter: { date: dateStr, level: row.level, mnId: row.mnId },
        update: {
          $set: {
            mnId: row.mnId,
            oaId: row.oaId,
            level: row.level,
            title: row.title,
            body: row.body,
            summary: row.summary,
            imgUrl: row.imgUrl,
            inputAt: row.input_at,
            date: dateStr,
          },
        },
        upsert: true,
      },
    }));

    const res = await DailyNews.bulkWrite(ops);
    return res;
  } finally {
    conn.release();
  }
}

module.exports = { syncDailyNewsForDate };
