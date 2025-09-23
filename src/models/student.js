const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    schoolType: { type: String, enum: ["middle", "high"], required: true },
    grade: { type: Number, required: true },
    level: { type: Number, default: 1 },
  },
  { timestamps: true } // 가입일자 구하려고 추가함
);

// 비밀번호 해시
studentSchema.pre("save", async function (next) {
  // 이미 $2b$로 시작하면 이미 해시된 비밀번호
  if (this.password.startsWith("$2b$")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 비밀번호 비교
studentSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);
module.exports = Student;
