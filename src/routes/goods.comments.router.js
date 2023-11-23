import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { commentsSchema } from "../validation/joi.js";

const router = express.Router();

// 상세 제품 글에 댓글 등록
router.post("/goods/:goodsId", async (req, res, next) => {
  try {
    const { goodsId } = req.params;
    const validation = await commentsSchema.validateAsync(req.body);
    const { comment } = validation;

  const findUserComment = await prisma.comments.findFirst({
    where : {GoodsId : +goodsId}
  })
  if(findUserComment){return res.status(400).json({message : "하나의 댓글만 작성할 수 있습니다."})}
  
    const createComment = await prisma.comments.create({
      data: {
        GoodsId: +goodsId,
        comment: comment,
      },
    });
    return res.status(201).json({ message: "댓글이 등록 되었습니다." });
  } catch (err) {
    next(err);
  }
});

// 상세 제품 글에 댓글 수정
router.patch("/goods/:goodsId", async (req, res, next) => {
  try {
    const { goodsId } = req.params;
    const validation = await commentsSchema.validateAsync(req.body);
    const { comment } = validation;

    const findComment = await prisma.comments.findFirst({
      where: { GoodsId: +goodsId },
    });

    if(!findComment){return res.status(400).json({message : "내가 등록한 댓글만 수정할 수 있습니다."})}

    await prisma.comments.update({
      where: {
        GoodsId: +goodsId,
        commentId: findComment.commentId,
      },
      data: {
        comment: comment,
      },
    });
    return res.status(201).json({ message: "댓글이 수정 되었습니다." });
  } catch (err) {
    next(err)
  }
});

// 상세 제품 글에 댓글 삭제
router.delete("/goods/:goodsId", async (req, res, next) => {
  try {
    const { goodsId } = req.params;

    const findComment = await prisma.comments.findFirst({
      where: { GoodsId: +goodsId },
    });
    if(!findComment){return res.status(400).json({message : "내가 등록한 댓글만 삭제할 수 있습니다."})}

    await prisma.comments.delete({
      where: { GoodsId: +goodsId, commentId : findComment.commentId},
    });
    return res.status(201).json({ message: "댓글이 삭제 되었습니다." });
  } catch (err) {
    next(err)
  }
});

export default router;
