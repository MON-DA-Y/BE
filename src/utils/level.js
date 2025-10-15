const getLevelLabel = (level) => {
  switch (level) {
    case 1:
      return "씨앗";
    case 2:
      return "새싹";
    case 3:
      return "잎새";
    case 4:
      return "가지";
    case 5:
      return "나무";
    case 6:
      return "꽃";
    case 7:
      return "열매";
    default:
      return "씨앗";
  }
};

module.exports = {getLevelLabel};                                  
