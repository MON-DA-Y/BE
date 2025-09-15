const Student = require("../models/student");
const Parent = require("../models/parent");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dummy_secret";

// 학생 로그인
exports.studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student) return res.status(400).json({ message: "등록되지 않은 이메일입니다." });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: "비밀번호가 틀렸습니다." });

    const token = jwt.sign({ studentId: student._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "학생 로그인 중 오류 발생" });
  }
};

// 학부모 로그인
exports.parentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const parent = await Parent.findOne({ email });
    if (!parent) return res.status(400).json({ message: "등록되지 않은 이메일입니다." });

    const isMatch = await bcrypt.compare(password, parent.password);
    if (!isMatch) return res.status(400).json({ message: "비밀번호가 틀렸습니다." });

    const token = jwt.sign({ parentId: parent._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "학부모 로그인 중 오류 발생" });
  }
};
