const Student = require("../models/student");
const Parent = require("../models/parent");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dummy_secret";

// 학생 회원가입
exports.studentSignUp = async (req, res) => {
  try {
    const { name, email, password, schoolType, grade } = req.body;

    const existing = await Student.findOne({ email });
    if (existing) return res.status(400).json({ message: "이미 가입된 이메일입니다." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({ name, email, password: hashedPassword, schoolType, grade });
    await student.save();

    const token = jwt.sign({ studentId: student._id }, JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "학생 회원가입 중 오류 발생" });
  }
};

// 학부모 회원가입
exports.parentSignUp = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existing = await Parent.findOne({ email });
    if (existing) return res.status(400).json({ message: "이미 가입된 이메일입니다." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const parent = new Parent({ name, email, phone, password: hashedPassword });
    await parent.save();

    const token = jwt.sign({ parentId: parent._id }, JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "학부모 회원가입 중 오류 발생" });
  }
};
