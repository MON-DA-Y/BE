//뉴스 더미데이터
const dummyNews = {
  // studentId
  1: {
    // week
    3: {
      newsList: [
        {
          newsId: 201,
          category: "MONEY",
          title: "금리 인상과 경제 영향",
          imgUrl:
            "https://png.pngtree.com/thumb_back/fh260/background/20210902/pngtree-blue-technology-news-background-image_782264.jpg",
          isCorrect: true,
        },
        {
          newsId: 202,
          category: "GLOBAL",
          title: "세계 경제 성장률 전망",
          imgUrl: null,
          isCorrect: false,
        },
        {
          newsId: 203,
          category: "INDUSTRIES",
          title: "자동차 산업의 전기차 전환",
          imgUrl:
            "https://media.istockphoto.com/id/1733213138/ko/%EC%82%AC%EC%A7%84/%EA%B3%A0%EA%B8%89-%EC%9E%90%EB%8F%99%ED%99%94-%EC%8A%A4%EB%A7%88%ED%8A%B8-%ED%8C%A9%ED%86%A0%EB%A6%AC%EC%9D%98-ev-%EC%83%9D%EC%82%B0-%EB%9D%BC%EC%9D%B8-%EA%B3%A0%EC%84%B1%EB%8A%A5-%EC%A0%84%EA%B8%B0-%EC%9E%90%EB%8F%99%EC%B0%A8-%EC%A0%9C%EC%A1%B0-%EC%A1%B0%EB%A6%BD-%EB%9D%BC%EC%9D%B8%EC%9D%98-%EC%A0%84%EA%B8%B0-%EC%9E%90%EB%8F%99%EC%B0%A8%EC%97%90-%EC%9E%90%EB%8F%99%EC%B0%A8-%EB%B0%B0%ED%84%B0%EB%A6%AC-%EC%84%A4%EC%B9%98-%EC%9E%90%EB%8F%99%EC%B0%A8-%EA%B3%B5%EC%9E%A5.jpg?s=612x612&w=0&k=20&c=YDk_AeG0pOIkrfgpULiYu7OJ1Ga8cEEnRO7rd5neQeU=",
          isCorrect: true,
        },
        {
          newsId: 204,
          category: "ISSUES",
          title: "청년 실업 문제",
          imgUrl: null,
          isCorrect: false,
        },
      ],
    },
  },
};

exports.getNewsByWeek = (req, res) => {
  const { studentId } = req.params;
  const { week } = req.query;

  if (!week) {
    return res.status(400).json({ message: "해당 주차를 선택해주세요." });
  }

  const news = dummyNews[studentId]?.[week];

  if (!news) {
    return res.status(404).json({ message: "해당 데이터가 없습니다." });
  }

  res.json({
    week: parseInt(week, 10),
    newsList: news.newsList,
  });
};
