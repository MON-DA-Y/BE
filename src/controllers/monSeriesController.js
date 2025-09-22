const StudentSeries = require("../models/studentSeries");
const { Series, SeriesKeyword } = require("../models/syncSeries");
const { getUserIdFromToken } = require("../utils/auth");

// [GET] 동기화된 시리즈 전체 조회
exports.getAllSeries = async (req, res) => {
  try {
    // 키워드 목록 조회
    const keywords = await SeriesKeyword.find().lean();
    // 시리즈 전체 조회
    const seriesList = await Series.find().lean();

    // 키워드별 시리즈 그룹핑 및 구조 변환
    const result = keywords.map((kw) => {
      // 해당 키워드의 시리즈들
      const seriesForKeyword = seriesList
        .filter((s) => s.kwId === kw.kwId)
        .map((s) => ({
          id: s.msId,
          keyword: kw.mainKeyword,
          title: s.title,
          sub_title: s.subtitle,
          parts: s.articles.map((a) => ({
            id: a.msaId,
            title: a.title,
            subtitle: a.subtitle,
            main: a.main,
            summary: a.summary,
            practice: a.practice,
            wordItems: a.wordItems
              ? a.wordItems.map((wi) => ({
                  msaWiId: wi.msaWiId,
                  word: wi.word,
                  meaning: wi.meaning,
                }))
              : [],
          })),
        }));

      return {
        id: kw.kwId,
        keyword: kw.mainKeyword,
        explain: kw.explain || "",
        series: seriesForKeyword,
      };
    });

    return res.status(200).json({
      result: result,
      message: "동기화된 시리즈 목록입니다.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "시리즈 조회 실패" });
  }
};

// [POST] 시리즈 파트 완료 → 학생에게 배정
exports.assignSeriesPartToStudent = async (req, res) => {
  try {
    const studentId = getUserIdFromToken(req);
    const { msId, msaId } = req.body; // 시리즈ID, 파트ID

    // 1. 시리즈 및 해당 파트 가져오기
    const series = await Series.findOne({ msId }).lean();
    if (!series) {
      return res.status(404).json({ message: "시리즈를 찾을 수 없습니다." });
    }
    const part = series.articles.find((a) => a.msaId === msaId);
    if (!part) {
      return res.status(404).json({ message: "파트를 찾을 수 없습니다." });
    }

    // 2. 학생에게 이미 배정된 시리즈가 있는지 확인
    let studentSeries = await StudentSeries.findOne({ studentId, msId });
    if (!studentSeries) {
      // 없으면 새로 생성
      studentSeries = await StudentSeries.create({
        studentId,
        msId: series.msId,
        title: series.title,
        subtitle: series.subtitle,
        articles: [part],
      });
    } else {
      // 이미 있으면 해당 파트가 없을 때만 추가
      const exists = studentSeries.articles.some((a) => a.msaId === msaId);
      if (!exists) {
        studentSeries.articles.push(part);
        await studentSeries.save();
      }
    }

    return res.status(200).json({
      message: `${msId} 시리즈 ${msaId} 파트가 배정되었습니다.`,
      result: {
        studentSeriesId: studentSeries._id,
        msId: series.msId,
        title: series.title,
        subtitle: series.subtitle,
        articles: studentSeries.articles,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "시리즈 파트 배정 실패" });
  }
};
