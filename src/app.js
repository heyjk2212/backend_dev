import express from "express";
import UsersRouter from "./routes/users.router.js";
import OrdersRouter from "./routes/orders.router.js";
import GoodsRouter from "./routes/goods.router.js";
import GoodsCommentsRouter from "./routes/goods.comments.router.js";
import cookieParser from "cookie-parser";

const app = express();
const router = express.Router();
const PORT = 3000;


app.use(express.json());
app.use(cookieParser());

router.get("/", (req, res) => {
  return res.status(200).json({ message: "성공!" });
});

app.use("/api", [router,UsersRouter,OrdersRouter,GoodsRouter,GoodsCommentsRouter]);

app.listen(PORT, () => {
  console.log(PORT, `${PORT} 포트로 서버가 열렸어요!`);
});

export default router;
