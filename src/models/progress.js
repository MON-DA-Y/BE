const mongoose = require("mongoose");
const Student = require("../models/student");

// strikeDay에 따른 Level
const getLevelByStrike = (strikeDay) => {
  if (strikeDay >= 700) return 7;
  if (strikeDay >= 365) return 6;
  if (strikeDay >= 200) return 5;
  if (strikeDay >= 100) return 4;
  if (strikeDay >= 66) return 3;
  if (strikeDay >= 21) return 2;
  return 1;
};

const progressSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  weekCompletionRate: { type: Number, required: true, default: 0 },
  strikeDay: { type: Number, required: true, default: 0 },
  days: [
    {
      day: { type: Date, required: true },
      tasks: {
        word: { type: String, enum: ["done", "pending"], default: "pending" },
        news: { type: String, enum: ["done", "pending"], default: "pending" },
        series: { type: String, enum: ["done", "ongoing", "pending"], default: "pending" },
        quiz: { type: String, enum: ["done", "pending"], default: "pending" },
      },
    },
  ],
});

// 다 완료하면 strikeDay +1
// strikeDay 다음주되면 리셋하는 거 추후에 수정
progressSchema.statics.updateStrikeDay = async function (studentId, today) {
  const progress = await this.findOne({ studentId });
  if (!progress) return;

  const todayData = progress.days.find((d) => d.day.toISOString().split("T")[0] === today);
  if (!todayData) return;

  const { word, news, series, quiz } = todayData.tasks;
  if (word === "done" && news === "done" && series === "done" && quiz === "done") {
    // strikeDay 증가
    progress.strikeDay += 1;
    await progress.save(); // 저장
  }

  // Student DB Level 업데이트
  const newLevel = getLevelByStrike(progress.strikeDay);
  const student = await Student.findById(studentId);
  if (student.level !== newLevel) {
    student.level = newLevel;
    await student.save();
  }
};

// 주차 완성도 계산 후 업데이트
progressSchema.statics.updateWeekCompletionRate = async function (studentId) {
  const progress = await this.findOne({ studentId });
  if (!progress || !progress.days.length) return;

  let totalTasks = 0;
  let completedTasks = 0;

  progress.days.forEach((day) => {
    const tasks = Object.values(day.tasks);
    totalTasks += tasks.length;
    completedTasks += tasks.filter((status) => status === "done").length;
  });

  const weekCompletionRate = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

  // DB 업데이트
  await this.updateOne({ studentId }, { $set: { weekCompletionRate } });

  return weekCompletionRate;
};

module.exports = mongoose.model("Progress", progressSchema);
