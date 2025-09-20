// AI DB(MySQL) → MongoDB 동기화 로직
const mysqlPool = require("../config/mysql");
const DailyNews = require("../models/daily/dailyNews");
const DailyWord = require("../models/daily/dailyWord");

// 뉴스 동기화
async function syncDailyNewsForDate(dateStr) {
  const conn = await mysqlPool.getConnection();
  try {
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

// 단어 동기화
async function syncDailyWordsForDate(dateStr) {
  const conn = await mysqlPool.getConnection();
  try {
    const [rows] = await conn.execute(
      `
      SELECT
        mw.mn_id AS mnId,
        mw.update_at AS inputAt,
        mwi.mwi_id AS mwiId,
        mwi.word,
        mwi.meaning,
        mwi.practice,
        mwi.position,
        mn.oa_id AS oaId,
        mn.level AS level
      FROM mon_words mw
      JOIN mon_word_items mwi ON mw.mw_id = mwi.mw_id
      JOIN mon_news mn ON mw.mn_id = mn.mn_id
      WHERE DATE(mw.input_at) = ?
      ORDER BY mw.mn_id, mwi.position
    `,
      [dateStr]
    );

    if (!rows.length) return { inserted: 0 };

    // mnId별로 단어를 그룹화
    const groupedWords = rows.reduce((acc, row) => {
      const {
        mnId,
        oaId,
        level,
        inputAt,
        mwiId,
        word,
        meaning,
        practice,
        position,
      } = row;
      const key = mnId;

      if (!acc[key]) {
        acc[key] = {
          mnId,
          oaId,
          level,
          inputAt,
          words: [],
        };
      }
      acc[key].words.push({
        mwiId,
        word,
        meaning,
        practice,
        position,
      });
      return acc;
    }, {});

    const ops = Object.values(groupedWords).map((doc) => ({
      updateOne: {
        filter: { mnId: doc.mnId },
        update: {
          $set: {
            mnId: doc.mnId,
            oaId: doc.oaId,
            level: doc.level,
            inputAt: doc.inputAt,
            words: doc.words,
          },
        },
        upsert: true,
      },
    }));

    const res = await DailyWord.bulkWrite(ops);
    return res;
  } finally {
    conn.release();
  }
}

module.exports = { syncDailyNewsForDate, syncDailyWordsForDate };
