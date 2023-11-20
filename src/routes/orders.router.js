import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// 장바구니 조회
router.get("/orders", authMiddleware, async (req, res, next) => {
    try {
        const { userId } = req.user;

        if(req.user.userType === "SELLER"){
            return res.status(400).json({message : "권한이 없습니다."})
        }

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
    } catch (err) {
        next(err)
    }
});

// 장바구니에 상품 넣기
router.post("/orders", authMiddleware, async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { goodsId, quantity } = req.body;

        if(req.user.userType === "SELLER"){
            return res.status(400).json({message : "권한이 없습니다."})
        }

        const findGoods = await prisma.goods.findFirst({
            where: { goodsId: +goodsId },
        });

        const totalPrice = findGoods.price * quantity;

        const JoinOrders = await prisma.orders.create({
            data: {
                UserId: +userId,
                GoodsId: +goodsId,
                quantity: quantity,
                totalPrice: totalPrice,
            },
        });
        return res
            .status(201)
            .json({ message: "장바구니에 상품이 추가 되었습니다." });
    } catch (err) {
        next(err)
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

        const deleteOrder = await prisma.orders.delete({
            where: { UserId: +userId, orderId: +orderId },
        });

        return res
            .status(201)
            .json({ message: "상품이 장바구니에서 삭제 되었습니다." });
    } catch (err) {
        next(err)
    }
});

export default router;
