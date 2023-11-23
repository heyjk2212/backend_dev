import express from "express";
import { prisma } from "../utils/prisma/index.js";

const router = express.Router();

// 장바구니 조회
router.get("/orders", async (req, res, next) => {
  try {
    const Orders = await prisma.orders.findMany({
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
  } catch (err) {
    next(err);
  }
});

// 장바구니에 상품 넣기
router.post("/orders", async (req, res, next) => {
  try {
    let { goodsId, quantity } = req.body;
    if (typeof quantity === "string") {
      quantity = parseInt(quantity);
    }
    console.log(typeof quantity);
    const findGoods = await prisma.goods.findFirst({
      where: { goodsId: +goodsId },
    });
    console.log(findGoods);

    const totalPrice = findGoods.price * +quantity;

    const JoinOrders = await prisma.orders.create({
      data: {
        GoodsId: +goodsId,
        quantity: quantity,
        totalPrice: totalPrice,
      },
    });
    return res
      .status(201)
      .json({ message: "장바구니에 상품이 추가 되었습니다." });
  } catch (err) {
    next(err);
  }
});

// 장바구니에 있는 상품 삭제
router.delete("/orders/:orderId", async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const findOrder = await prisma.orders.findFirst({
      where: { orderId: +orderId },
    });

    const deleteOrder = await prisma.orders.delete({
      where: { orderId: +orderId },
    });

    return res
      .status(201)
      .json({ message: "상품이 장바구니에서 삭제 되었습니다." });
  } catch (err) {
    next(err);
  }
});

export default router;
