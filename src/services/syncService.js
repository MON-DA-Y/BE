// AI DB(MySQL) → MongoDB 동기화 로직
const mysqlPool = require("../config/mysql");
const DailyNews = require("../models/daily/dailyNews");
const DailyWord = require("../models/daily/dailyWord");
const DailyQuiz = require("../models/daily/dailyQuiz");

// 뉴스 동기화
async function syncDailyNewsForDate(dateStr) {
  const conn = await mysqlPool.getConnection();
  try {
    const [rows] = await conn.execute(
      `
        SELECT m.mn_id AS mnId, m.oa_id AS oaId, m.level, m.title, m.main AS body,
            m.summary, m.input_at, o.img_url AS imgUrl, m.category
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
            category: row.category,
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
        mn.level AS level,
        mn.category AS category
      FROM mon_words mw
      JOIN mon_word_items mwi ON mw.mw_id = mwi.mw_id
      JOIN mon_news mn ON mw.mn_id = mn.mn_id
      WHERE DATE(mw.input_at) = ?
      ORDER BY mw.mn_id, mwi.position
    `,
      [dateStr]
    );

    if (!rows.length) return { inserted: 0 };

    // mnId별 그룹화
    const groupedWords = rows.reduce((acc, row) => {
      const {
        mnId,
        oaId,
        level,
        category,
        inputAt,
        mwiId,
        word,
        meaning,
        practice,
        position,
      } = row;
      const key = `${mnId}_${dateStr}`;

      if (!acc[key]) {
        acc[key] = {
          mnId,
          oaId,
          level,
          category,
          inputAt,
          words: [],
        };
      }

      acc[key].words.push({ mwiId, word, meaning, practice, position });
      return acc;
    }, {});

    const ops = Object.values(groupedWords).map((doc) => ({
      updateOne: {
        filter: { mnId: doc.mnId, date: dateStr },
        update: {
          $set: {
            mnId: doc.mnId,
            oaId: doc.oaId,
            level: doc.level,
            category: doc.category,
            inputAt: doc.inputAt,
            words: doc.words,
          },
        },
        upsert: true,
      },
    }));

    return await DailyWord.bulkWrite(ops);
  } finally {
    conn.release();
  }
}

// 퀴즈 동기화
async function syncDailyQuizForDate(dateStr) {
  const conn = await mysqlPool.getConnection();
  try {
    const [rows] = await conn.execute(
      `
      SELECT mq.mq_id AS mqId, mq.mn_id AS mnId, mn.oa_id AS oaId, mn.level, mn.category, mq.input_at,
             mqi.mqi_id AS mqiId, mqi.question, mqi.choices, mqi.answer, mqi.explanation AS marking,
             mqi.source, mqi.position
      FROM mon_quiz mq
      JOIN mon_quiz_items mqi ON mq.mq_id = mqi.mq_id
      JOIN mon_news mn ON mq.mn_id = mn.mn_id
      WHERE DATE(mq.input_at) = ?
      ORDER BY mq.mq_id, mqi.position
      `,
      [dateStr]
    );

    if (!rows.length) return { inserted: 0 };

    // mqId별로 그룹화
    const grouped = rows.reduce((acc, row) => {
      const { mqId, mnId, level, category } = row;
      if (!acc[mqId]) acc[mqId] = { mqId, mnId, level, category, quizList: [] };
      acc[mqId].quizList.push({
        mqiId: row.mqiId,
        question: row.question,
        choices: JSON.parse(row.choices),
        answer: row.answer,
        marking: row.marking,
        source: row.source,
        position: row.position,
      });
      return acc;
    }, {});

    // bulkWrite 준비
    const ops = Object.values(grouped).map((doc) => ({
      updateOne: {
        filter: { date: dateStr, mqId: doc.mqId },
        update: {
          date: dateStr,
          mqId: doc.mqId,
          mnId: doc.mnId,
          level: doc.level,
          category: doc.category,
          quizList: doc.quizList,
          updatedAt: new Date(),
        },
        upsert: true,
      },
    }));

    const res = await DailyQuiz.bulkWrite(ops);
    return res;
  } finally {
    conn.release();
  }
}

module.exports = {
  syncDailyNewsForDate,
  syncDailyWordsForDate,
  syncDailyQuizForDate,
};
