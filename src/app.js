import express from "express";
import UsersRouter from "./routes/users.router.js";
import cookieParser from "cookie-parser";
import errorHandlingMiddleware from "./middlewares/error-handling.middleware.js";
import logMiddleware from "./middlewares/log.middleware.js";
import GoodsCommentsRouter from "./routes/goods.comments.router.js";
import OrdersRouter from "./routes/orders.router.js";
import GoodsRouter from "./routes/goods.router.js";

const app = express();
const router = express.Router();
const PORT = 3000;

app.use(logMiddleware);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

router.get("/", (req, res) => {
  return res.status(200).json({ message: "성공!" });
});

app.use("/api", [router,UsersRouter,OrdersRouter,GoodsRouter,GoodsCommentsRouter]);

app.use(errorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(PORT, `Server running on port ${PORT}`);
});

export default router;
