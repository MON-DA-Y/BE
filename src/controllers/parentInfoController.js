const Parent = require("../models/parent");
const { getUserIdFromToken } = require("../utils/auth");

// [get] 학부모 정보 조회
exports.getParentInfo = async (req, res) => {
  const parentId = getUserIdFromToken(req, "parent"); // 테스트용 디폴트

  try {
    // DB에서 조회, 비밀번호 제외
    const parent = await Parent.findById(parentId).select("-password");
    if (!parent) return res.status(404).json({ message: "학생 정보가 없습니다." });

    const responsePrtInfo = {
      prt_name: parent.name,
      prt_email: parent.email,
      prt_phone: parent.phone,
    };

    res.json({ result: responsePrtInfo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};
