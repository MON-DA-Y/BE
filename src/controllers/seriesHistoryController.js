//시리즈 더미데이터
const dummySeries = {
  // studentId
  1: {
    // week
    3: {
      seriesList: [
        {
          seriesId: 301,
          title: "AI 혁신 이야기",
          sub_title: "인공지능이 바꾸는 미래 산업",
          keyword: "인플레이션",
          status: "ongoing",
          totalCount: 2,
          learnedCount: 1,
          imgUrl:
            "https://png.pngtree.com/thumb_back/fh260/background/20210902/pngtree-blue-technology-news-background-image_782264.jpg",
          parts: [
            {
              partId: 1,
              isLearned: true,
              part_title: "AI와 경제 구조 변화",
              part_sub_title: "산업별 자동화 사례",
            },
            {
              partId: 2,
              isLearned: false,
              part_title: "AI가 금융 시장에 미치는 영향",
              part_sub_title: "투자, 고용, 생산성 분석",
            },
          ],
        },
        {
          seriesId: 302,
          title: "글로벌 경제 트렌드",
          sub_title: "세계 경제의 큰 흐름과 변화",
          keyword: "금리",
          status: "done",
          totalCount: 2,
          learnedCount: 2,
          imgUrl: null,
          parts: [
            {
              partId: 11,
              isLearned: true,
              part_title: "금리 인상의 배경",
              part_sub_title: "중앙은행과 통화정책",
            },
            {
              partId: 12,
              isLearned: true,
              part_title: "금리 변동의 파급 효과",
              part_sub_title: "가계, 기업, 금융시장에 미치는 영향",
            },
          ],
        },
      ],
    },
  },
};

exports.getSeriesByWeek = (req, res) => {
  const { studentId } = req.params;
  const { week } = req.query;

  if (!week) {
    return res.status(400).json({ message: "해당 주차를 선택해주세요." });
  }

  const series = dummySeries[studentId]?.[week];

  if (!series) {
    return res.status(404).json({ message: "해당 데이터가 없습니다." });
  }

  res.json({
    week: parseInt(week, 10),
    seriesList: series.seriesList,
  });
};
