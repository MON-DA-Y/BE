const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    studentId: { type: Number, required: true },
    days: [
      {
        day: { type: Date, required: true },
        isAttended: { type: Boolean, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
