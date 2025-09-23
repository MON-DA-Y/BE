const Student = require("../models/student");
const Parent = require("../models/parent");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dummy_secret";

// 학생 회원가입
const studentSignUp = async (req, res) => {
  try {
    const { name, email, password, schoolType, grade } = req.body;

    // 이미 가입된 이메일 체크
    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "이미 가입된 이메일입니다." });
    }

    // 비밀번호 해시
    const hashedPassword = await bcrypt.hash(password, 10);

    // 학생 생성
    const student = new Student({ name, email, password: hashedPassword, schoolType, grade });
    console.log("저장 직전 student 객체:", student);
    await student.save();
    const savedStudent = await Student.findOne({ email });
    console.log("DB에 실제 저장된 student:", savedStudent);

    // JWT 발급
    const token = jwt.sign({ studentId: student._id }, JWT_SECRET);
    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "학생 회원가입 중 오류 발생" });
  }
};

// 학부모 회원가입
const parentSignUp = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // 이미 가입된 이메일 체크
    const existing = await Parent.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "이미 가입된 이메일입니다." });
    }

    // 비밀번호 해시
    const hashedPassword = await bcrypt.hash(password, 10);

    // 학부모 생성
    const parent = new Parent({ name, email, phone, password: hashedPassword });
    await parent.save();

    // JWT 발급
    const token = jwt.sign({ parentId: parent._id }, JWT_SECRET);
    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "학부모 회원가입 중 오류 발생" });
  }
};

// module.exports로 내보내기
module.exports = {
  studentSignUp,
  parentSignUp,
};
