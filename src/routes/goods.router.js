import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { goodsSchema } from "../validation/joi.js";

const router = express.Router();

// 제품 글 작성
router.post("/goods/content", async (req, res, next) => {
  try {
    const validation = await goodsSchema.validateAsync(req.body);
    const { goodsName, imageUrl, price, content } = validation;

    await prisma.goods.create({
      data: {
        goodsName: goodsName,
        imageUrl: imageUrl,
        price: price,
        content: content,
      },
    });
    return res.status(201).json({ message: "게시글을 등록 하였습니다." });
  } catch (err) {
    next(err);
  }
});

// 메인페이지 이미지 목록 조회
router.get("/goods", async (req, res, next) => {
  try {
    const Goods = await prisma.goods.findMany({
      select: {
        goodsId: true,
        goodsName: true,
        price: true,
        imageUrl: true,
        likeCount: true,
      },
    });
    return res.status(201).json({ data: Goods });
  } catch (err) {
    next(err);
  }
});

// 제품 글 수정
router.patch("/goods/:goodsId/content", async (req, res, next) => {
  try {
    const { goodsId } = req.params;
    const validation = await goodsSchema.validateAsync(req.body);
    const { goodsName, imageUrl, price, content } = validation;

    const findGoods = await prisma.goods.findFirst({
      where: { goodsId: +goodsId },
    });

    await prisma.goods.update({
      where: { goodsId: +goodsId },
      data: {
        goodsName: goodsName,
        imageUrl: imageUrl,
        price: price,
        content: content,
      },
    });
    return res.status(201).json({ message: "수정이 완료 되었습니다." });
  } catch (err) {
    next(err);
  }
});

// 제품 글 삭제
router.delete("/goods/:goodsId/content", async (req, res, next) => {
  try {
    const { goodsId } = req.params;

    const existsGoods = await prisma.goods.findFirst({
      where: { goodsId: +goodsId },
    });
    if (!existsGoods) {
      return res.status(401).json({ message: "상품이 존재하지 않습니다." });
    }

    await prisma.goods.delete({
      where: { goodsId: +goodsId },
    });
    return res.status(201).json({ message: "삭제가 완료 되었습니다." });
  } catch (err) {
    next(err);
  }
});

// 상세 정보 글 조회
router.get("/goods/:goodsId", async (req, res, next) => {
  try {
    const { goodsId } = req.params;
    const Goods = await prisma.goods.findFirst({
      where: { goodsId: +goodsId },
      select: {
        goodsName: true,
        price: true,
        imageUrl: true,
        content: true,
        Comments: {
          select: {
            comment: true,
          },
        },
      },
    });

    return res.status(201).json({ data: Goods });
  } catch (err) {
    next(err);
  }
});

router.post("/goods/:goodsId/like", async (req, res, next) => {
  try {
    const { goodsId } = req.params;

    let isLike = await prisma.likes.findFirst({
      where: { GoodsId: +goodsId },
    });

    if (!isLike) {
      await prisma.likes.create({
        data: {
          GoodsId: +goodsId,
        },
      });

      await prisma.goods.update({
        where: { goodsId: +goodsId },
        data: {
          likeCount: {
            increment: 1,
          },
        },
      });
      return res
        .status(200)
        .json({ message: "게시글의 좋아요를 등록하였습니다." });
    } else {
      await prisma.likes.delete({ where: { likeId: +isLike.likeId } });

      await prisma.goods.update({
        where: { goodsId: +goodsId },
        data: {
          likeCount: {
            decrement: 1,
          },
        },
      });
      return res
        .status(200)
        .json({ message: "게시글의 좋아요를 취소하였습니다." });
    }
  } catch (err) {
    next(err);
  }
});

export default router;
