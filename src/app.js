import express from "express";
import UsersRouter from "./routes/users.router.js";

const app = express();
const router = express.Router();
const PORT = 3000;

app.use(express.json()); // body parser

router.get("/", (req, res) => {
  return res.status(200).json({ message: "성공!" });
});

app.use("/api", [router, UsersRouter]);

app.listen(PORT, () => {
  console.log(PORT, `${PORT} 포트로 서버가 열렸어요!`);
});

export default router;
