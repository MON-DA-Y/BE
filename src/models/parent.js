const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const parentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
});

// 비밀번호 해시
parentSchema.pre("save", async function (next) {
  // 이미 $2b$로 시작하면 이미 해시된 비밀번호
  if (this.password.startsWith("$2b$")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 비밀번호 비교
parentSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Parent = mongoose.models.Parent || mongoose.model("Parent", parentSchema);
module.exports = Parent;
