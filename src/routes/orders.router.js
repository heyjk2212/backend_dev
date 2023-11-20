import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// 장바구니 조회
router.get("/orders", authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.user;

    const Orders = await prisma.orders.findMany({
      where: { UserId: userId },
      select: {
        Good: {
          select: {
            goodsName: true,
            price: true,
            imageUrl: true,
          },
        },
        totalPrice: true,
        quantity: true,
      },
    });

    return res.status(201).json({ data: Orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 에러" });
  }
});

// 장바구니에 상품 넣기
router.post("/orders", authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { goodsId, quantity } = req.body;

    const findGoods = await prisma.goods.findFirst({
      where: { goodsId: +goodsId },
    });
    if (!findGoods) {
      return res
        .status(401)
        .json({ message: "해당 상품은 존재하지 않습니다." });
    }

    const totlaPrice = findGoods.price * quantity;

    const JoinOrders = await prisma.orders.create({
      data: {
        UserId: +userId,
        GoodsId: +goodsId,
        quantity: quantity,
        totalPrice: totlaPrice,
      },
    });
    return res
      .status(201)
      .json({ message: "장바구니에 상품이 추가 되었습니다." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 에러" });
  }
});

// 장바구니에 있는 상품 삭제
router.delete("/orders", authMiddleware, async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const { userId } = req.user;
    const findOrder = await prisma.orders.findFirst({
      where: { orderId: +orderId },
    });
    if (!findOrder) {
      return res.status(401).json({ message: "존재하지 않는 주문입니다." });
    }

    const deleteOrder = await prisma.orders.delete({
      where: { UserId: +userId, orderId: +orderId },
    });

    return res
      .status(201)
      .json({ message: "상품이 장바구니에서 삭제 되었습니다." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 에러" });
  }
});

export default router;
