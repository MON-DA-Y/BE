const mongoose = require("mongoose");

const studentNewsSchema = new mongoose.Schema({
  studentId: { type: Number, required: true, index: true },
  newsList: [
    {
      mnId: { type: Number, required: true },
      level: { type: String, required: true },
      title: { type: String },
      body: { type: String },
      summary: { type: String },
      imgUrl: { type: String },
      assignedAt: { type: Date, default: Date.now }, // 학생에게 할당된 시각
      learningDate: { type: Date, default: null }, // 학생이 실제로 학습한 시각
      completed: { type: Boolean, default: false },
    },
  ],
});

studentNewsSchema.index({ studentId: 1, "newsList.mnId": 1 });

module.exports = mongoose.model("StudentNews", studentNewsSchema);
