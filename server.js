const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB 연결 완료!"))
  .catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("백엔드 시작!");
});

app.listen(3000, () => {
  console.log("서버 시작: http://localhost:3000");
});
