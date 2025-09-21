const { getUserIdFromToken } = require("../utils/auth");
const Progress = require("../models/progress");
const QuizResult = require("../models/quizResult");
const DailyQuiz = require("../models/daily/dailyQuiz");
const StudentQuiz = require("../models/studentQuiz");
const StudentNews = require("../models/studentNews");
const StudentWord = require("../models/studentWord");
const Student = require("../models/student");
const { formateDate, getWeekRange, formatDate } = require("../utils/date");
const { Weakness } = require("../models/weakness");
const { format } = require("../config/mySql");

// mon_quiz_id로 category 가져오기
const getCategoryByQuiz = async (mq_id) => {
  const result = await MonQuiz.aggregate([
    { $match: { mq_id } }, // mon_quiz에서 mq_id
    {
      $lookup: {
        from: "mon_news", // mon_news
        localField: "mn_id",
        foreignField: "mn_id",
        as: "news",
      },
    },
    { $unwind: "$news" },
    {
      $lookup: {
        from: "org_article_tb", // org_article_tb
        localField: "news.oa_id",
        foreignField: "oa_id",
        as: "article",
      },
    },
    { $unwind: "$article" },
    { $project: { category: "$article.category", _id: 0 } },
  ]);

  if (!result.length) throw new Error("Category not found");

  return result[0].category;
};

// [POST] 학생에게 오늘 퀴즈 배정 (level)
exports.assignMonQuizToStudent = async (req, res) => {
  try {
    const studentId = getUserIdFromToken(req, "student");
    if (!studentId)
      return res.status(401).json({ message: "인증되지 않은 사용자입니다." });

    const studentInfo = await Student.findById(studentId).select("-password");
    if (!studentInfo)
      return res.status(404).json({ message: "학생 정보가 없습니다." });

    const level = studentInfo.level || "씨앗";
    const todayStr = formateDate(new Date());

    // 오늘 날짜 + 레벨에 맞는 DailyQuiz 가져오기
    const quizzes = await DailyQuiz.find({ date: todayStr, level }).lean();
    if (!quizzes.length)
      return res.status(404).json({ message: "오늘 배정할 퀴즈가 없습니다." });

    // 학생 퀴즈 DB 확인
    let studentQuiz = await StudentQuiz.findOne({ studentId });
    if (!studentQuiz) {
      const quizList = quizzes.map((q) => ({
        quizId: q.quizId,
        type: q.type,
        question: q.question,
        choices: q.choices,
        answer: q.answer,
        selectedAnswer: null,
        inCorrect: false,
        marking: q.marking,
        assignedAt: new Date(),
        completed: false,
        submit: false,
        submitDate: null,
      }));

      studentQuiz = await StudentQuiz.create({ studentId, quizList });
      return res.json({
        message: "오늘 MON 퀴즈가 배정되었습니다.",
        count: quizList.length,
      });
    }

    // 이미 저장된 퀴즈와 중복 제거
    const existIds = new Set(studentQuiz.quizList.map((q) => q.quizId));
    const newItems = quizzes
      .filter((q) => !existIds.has(q.quizId))
      .map((q) => ({
        quizId: q.quizId,
        type: q.type,
        question: q.question,
        choices: q.choices,
        answer: q.answer,
        selectedAnswer: null,
        inCorrect: false,
        marking: q.marking,
        assignedAt: new Date(),
        completed: false,
        submit: false,
        submitDate: null,
      }));

    if (newItems.length) {
      studentQuiz.quizList.push(...newItems);
      await studentQuiz.save();
    }

    res.json({
      message: "오늘 Mon 퀴즈가 배정되었습니다.",
      added: newItems.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "퀴즈 배정 실패" });
  }
};

// [get] 오늘의 monQuiz 조회
exports.getTodayMonQuiz = async (req, res) => {
  try {
    const studentId = getUserIdFromToken(req, "student");
    const today = formateDate(new Date());
    const studentQuiz = await StudentQuiz.findOne({ studentId }).lean();

    if (!studentQuiz)
      return res.status(404).json({ message: "오늘 Mon 퀴즈가 없습니다." });

    const todayQuiz = studentQuiz.quizList.filter(
      (q) => formateDate(q.assignedAt) === today
    );

    if (!todayQuiz.length)
      return res.status(404).json({ message: "오늘 Mon퀴즈가 없습니다." });

    res.json({
      result: todayQuiz.map((q) => ({
        id: q.quizId,
        type: q.type,
        question: q.question,
        choices: q.choices,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "오늘 Mon퀴즈 조회 실패" });
  }
};

// [post] 오늘의 MonQuiz 제출
exports.postMonQuizSubmit = async (req, res) => {
  try {
    const studentId = getUserIdFromToken(req, "student");
    const { selectedChoices } = req.body;
    const today = formateDate(new Date());

    if (!selectedChoices || !Object.keys(selectedChoices).length)
      return res.status(400).json({ message: "선택한 답이 없습니다." });

    const studentQuiz = await StudentQuiz.findOne({ studentId });
    if (!studentQuiz)
      return res.status(404).json({ message: "오늘 Mon퀴즈가 없습니다." });

    const todayQuiz = studentQuiz.quizList.filter(
      (q) => formateDate(q.assignedAt) === today
    );
    if (!todayQuiz.length)
      return res.status(404).json({ message: "오늘 Mon퀴즈가 없습니다." });

    // 선택 답 적용
    todayQuiz.forEach((quiz) => {
      const selected = selectedChoices[quiz.dqId];
      if (selected) {
        quiz.selectedAnswer = selected;
        quiz.isCorrect = quiz.answer === selected;
        quiz.submit = true;
        quiz.submitDate = new Date();
      }
    });

    await studentQuiz.save();

    // 틀린 퀴즈 id 추출
    // const wrongQuizIds = todayData.quizzes
    //   .filter((quiz) => !quiz.isCorrect)
    //   .map((quiz) => quiz.id);

    // 다른 서버로 전송
    // try {
    //   await axios.post(`${서버url}/wrong-quizzes`, {
    //     studentId,
    //     wrongQuizIds,
    //     submittedAt: new Date(),
    //   });
    //   console.log("틀린 퀴즈 id 전송 완료:", wrongQuizIds);
    // } catch (err) {
    //   console.error("틀린 퀴즈 전송 실패:", err.message);
    // }

    // score 계산
    const total = todayQuiz.length;
    const correct = todayQuiz.filter((q) => q.isCorrect).length;
    const percentage = Math.round((correct / total) * 100);

    // quizResult 컬렉션에 저장
    await QuizResult.updateOne(
      { studentId },
      {
        $push: {
          results: todayQuiz.quizzes.map((q) => ({
            quizId: q.quizId,
            day: today,
            score: percentage,
          })),
        },
      },
      { upsert: true }
    );

    // weakness 컬렉션에 저장
    const { weekEnd } = getWeekRange("이번주");
    const nextDay = new Date(weekEnd);
    nextDay.setDate(nextDay.getDate() + 1);

    const category = await getCategoryByQuiz(mq_id);

    await Weakness.updateOne(
      { studentId },
      {
        $push: {
          weakWord: {
            date: nextDay,
            categories: {
              category,
              total: total,
              correct: correct,
            },
            summary: null,
          },
          weakNews: {
            date: nextDay,
            categories: {
              category,
              total: total,
              correct: correct,
            },
            summary: null,
          },
        },
      },
      { upsert: true }
    );

    // progress에 오늘 퀴즈 완료 반영
    let progress = await Progress.findOne({ studentId });
    if (!progress) {
      // 없으면 새로 생성
      progress = await Progress.create({
        studentId,
        days: [{ day: today, tasks: { quiz: "done" } }],
      });
    } else {
      // 오늘 날짜 데이터 확인
      let todayData = progress.days.find((d) => formatDate(d.day) === today);
      if (!todayQuiz) {
        todayData = { day: today, tasks: { quiz: "done" } };
        progress.days.push(todayData);
      } else {
        todayData.tasks.quiz = "done";
      }
      await progress.save();
    }
    // strikeDay 및 weekCompletionRate 갱신
    await Progress.updateStrikeDay(studentId, today);
    await Progress.updateWeekCompletionRate(studentId);

    res.json({
      message: "오늘 Mon 퀴즈 제출 완료!",
      result: todayQuiz.map(
        ({ dqId, isCorrect, selectedAnswer, marking, answer }) => ({
          id: dqId,
          answer,
          isCorrect,
          selectedAnswer,
          marking,
        })
      ),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "퀴즈 제출 실패" });
  }
};

// [get] 오늘의 monQuiz 채점 조회
exports.getTodayMonQuizMark = async (req, res) => {
  try {
    const studentId = getUserIdFromToken(req, "student");
    const today = formateDate(new Date());

    const studentQuiz = await StudentQuiz.findOne({ studentId }).lean();
    if (!studentQuiz)
      return res.status(404).json({ message: "오늘 Mon퀴즈가 없습니다." });

    const todayQuiz = studentQuiz.quizList.filter(
      (q) => formateDate(q.assignedAt) === today && q.submit
    );

    if (!todayQuiz)
      return res.status(404).json({ message: "퀴즈를 제출하지 않았습니다." });

    // quizzes 배열에서 필요한 필드만 뽑아서 response
    const responseQuizMarks = todayQuiz.map(
      ({
        quizId,
        type,
        question,
        choices,
        answer,
        selectedAnswer,
        marking,
        isCorrect,
      }) => ({
        id: quizId,
        type,
        question,
        choices,
        answer,
        selectedAnswer,
        isCorrect,
        marking,
      })
    );

    res.json({ result: responseQuizMarks });
  } catch (err) {
    console.error(err);
    res.status(500).json("오늘 Mon퀴즈 채점 조회 실패");
  }
};

// [post] 오늘의 monQuiz 채점 학습/확인 완료
exports.postTodayMonQuizMarkDone = async (req, res) => {
  try {
    const studentId = getUserIdFromToken(req, "student");
    const today = formateDate(new Date());

    const studentQuiz = await StudentQuiz.findOne({ studentId });
    if (!studentQuiz)
      return res.status(404).json({ message: "오늘 Mon퀴즈가 없습니다." });

    const todayQuiz = studentQuiz.quizList.filter(
      (q) => formateDate(q.assignedAt) === today && q.submit
    );

    if (!todayQuiz)
      return res.status(404).json({ message: "퀴즈를 제출하지 않았습니다." });

    // 학습 완료 처리
    todayQuiz.forEach((q) => (q.completed = true));
    await studentQuiz.save();

    res.json({ message: "오늘 Mon 퀴즈 학습 완료!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "퀴즈 학습 완료 처리 실패" });
  }
};

// [get] 학생이 제출했는지 여부
exports.getStudentSubmit = async (req, res) => {
  try {
    const studentId = getUserIdFromToken(req, "student");
    const today = formatDate(new Date());

    const studentQuiz = await StudentQuiz.findOne({ studentId }).lean();
    if (!studentQuiz)
      return res.status(404).json({ message: "오늘 Mon퀴즈가 없습니다." });

    const todayQuiz = studentQuiz.quizList.filter(
      (q) => formateDate(q.assignedAt) === today
    );

    if (!todayQuiz)
      return res.status(404).json({ message: "오늘 Mon퀴즈가 없습니다." });

    const isSubmitted = todayQuiz.some((q) => q.submit);

    res.json({
      submit: isSubmitted,
      message: isSubmitted
        ? "오늘 Mon퀴즈 채점 확인 완료!"
        : "퀴즈를 제출하지 않았습니다.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "학생 제출 여부 조회 실패" });
  }
};

// [GET] monQuiz 활성화 여부 조회
exports.getMonQuizActive = async (req, res) => {
  try {
    const studentId = getUserIdFromToken(req, "student");
    if (!studentId)
      return res.status(401).json({ message: "인증되지 않은 사용자입니다." });

    const today = formatDate(new Date());

    // 오늘 할당된 뉴스 조회
    const studentNews = await StudentNews.findOne({ studentId }).lean();
    const todayNews =
      studentNews?.newsList?.filter(
        (item) => formatDate(item.assignedAt) === today
      ) || [];
    const allNewsCompleted = todayNews.every((news) => news.completed);

    // 오늘 할당된 단어 조회
    const studentWord = await StudentWord.findOne({ studentId }).lean();
    const todayWords =
      studentWord?.wordList?.filter(
        (item) => formatDate(item.assignedAt) === today
      ) || [];
    const allWordsCompleted = todayWords.every((word) => word.completed);

    // monQuiz 활성화 조건: 오늘 뉴스 + 단어 모두 완료
    const isMonQuizActive = allNewsCompleted && allWordsCompleted;

    return res.json({ active: isMonQuizActive });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "monQuiz 활성화 여부 조회 실패" });
  }
};
