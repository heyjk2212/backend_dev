import express from "express";
import {prisma} from '../utils/prisma/index.js';
const router = express.Router();

// 상세 제품 글에 댓글 등록
router.post('/goods/:goodsId', authMiddleware, async (req, res, next) => {
    try {
        const {goodsId} = req.params;
        const {userId} = req.user;
        const {comment} = req.body;

        const createComment = await prisma.comments.create({
            data : {
                UserId : +userId,
                GoodsId : +goodsId,
                comment : comment
            }
        });
        return res.status(201).json({message : "댓글이 등록 되었습니다."});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "서버 에러"});
    }
});

// 상세 제품 글에 댓글 수정
router.patch('/goods/:goodsId', authMiddleware, async (req, res, next) => {
    try {
        const {goodsId} = req.params;
        const {userId} = req.user;
        const {comment} = req.body;

        const findComment = await prisma.comments.findFirst({
            where : {GoodsId : +goodsId, UserId : +userId}
        });
        if (!findComment) {
            return res.status(401).json({message : "해당하는 데이터가 없습니다."});
        }

        await prisma.comments.update({
            where : {GoodsId : +goodsId, UserId : +userId, commentId : findComment.commentId},
            data : {
                comment : comment
            }
        });
        return res.status(201).json({message : "댓글이 수정 되었습니다."});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "서버 에러"});
    }
});

// 상세 제품 글에 댓글 삭제
router.delete('/goods/:goodsId', authMiddleware, async (req, res, next) => {
    try {
        const {goodsId} = req.params;
        const {userId} = req.user;
        const findComment = prisma.comments.findFirst({where : {GoodsId : +goodsId}})
        if(!findComment){return res.status(401).json({message : "댓글이 존재하지 않습니다."})}

        await prisma.comments.delete({where : {goodsId : +goodsId, userId : +userId}});
        return res.status(201).json({message : "댓글이 삭제 되었습니다."});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "서버 에러"});
    }
});

export default router;
