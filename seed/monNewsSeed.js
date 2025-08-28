require("dotenv").config();
const connectDB = require("../src/config/db");
// models 만든 뒤 경로 변경 !!
const News = require("../src/models/newsHistory");

const monNewsSeed = async () => {
  try {
    // 1. MongoDB 연결
    await connectDB();

    // DB 연결 안 한 상태
    const newsData = rows.map((row) => ({
      studentId: 1, // 필요시 수정
      newsList: [
        {
          newsId: 101,
          learningDate: new Date().toISOString().split("T")[0],
          title: "햄버거 값 또 올랐다! 인플레이션으로 물가 상승이 계속될까?",
          body: `"요즘 햄버거 가게에 가면 깜짝 놀라는 사람들이 많아요. 작년에는 5,500원이던 햄버거 세트가 올해는 6,500원이 되었기 때문이에요. 왜 이렇게 가격이 오르는 걸까요?\n\n이것은 바로 인플레이션 때문이에요. 인플레이션은 물건 값이 전반적으로 올라가는 현상을 말해요. 요즘은 고기, 빵, 채소 같은 재료 가격도 오르고, 직원들 월급도 올라서 음식점들이 가격을 올릴 수밖에 없어요.\n\n전문가들은 \"지금은 전 세계적으로 인플레이션이 계속되고 있어요. 물가가 안정될 때까지는 가격이 더 오를 수도 있어요.\"라고 말했어요.\n\n소비자들은 \"예전에는 같은 돈으로 더 많이 먹을 수 있었는데, 이제는 부담돼요.\"라며 걱정하고 있어요.\n\n여러분도 최근에 가격이 올라서 놀란 물건이 있나요? 🤔"`,
          summary: "최근 인플레이션 때문에 햄버거 값이 올라서 사람들이 부담을 느끼고 있어요",
          createdAt: new Date(),
        },
      ],
    }));

    await News.deleteMany();
    await News.insertMany(newsData);

    console.log("MongoDB 뉴스 데이터 삽입 완료!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

monNewsSeed();
