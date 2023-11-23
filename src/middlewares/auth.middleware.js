import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma/index.js";

export default async function (req, res, next) {
  try {
    const token = req.headers.authorization;

    console.log(">>>>>>>??");

    if (!token || !token.startsWith("Bearer ")) {
      throw new Error("올바른 토큰이 제공되지 않았습니다.");
    }

    const rawToken = token.split("Bearer ")[1].trim();

    const secretKey = process.env.SECRET_KEY;

    const decodedToken = jwt.verify(rawToken, secretKey);

    const userId = decodedToken.userId;

    // JWT에 있는 userId를 기반으로 사용자 검색
    const user = await prisma.users.findFirst({
      where: {
        userId: +userId,
      },
    });

    if (!user) {
      // 유저가 존재하지 않으면, 해당 쿠키는 비정상적이기 때문에 쿠키를 날린다.
      res.clearCookie("authorization");
      throw new Error("토큰 사용자가 존재하지 않습니다.");
    }

    req.user = user;

    next();
  } catch (error) {
    res.clearCookie("authorization"); // 특정 쿠키를 삭제시킨다

    switch (error.name) {
      case "TokenExpiredError": // 토큰이 만료되었을 때 발생하는 에러
        return res.status(401).json({ errorMessage: "토큰이 만료되었습니다." });

      case "JsonWebTokenError": // 토큰에 검증이 실패했을 때 발생하는 에러
        return res
          .status(401)
          .json({ errorMessage: "토큰 인증에 실패하였습니다." });

      default:
        return (
          res
            .status(401)
            // error에 있는 message가 비어있을 때만 "비 정상적인 요청입니다."가 출력된다.
            .json({ errorMessage: error.message ?? "비 정상적인 요청입니다." })
        );
    }
  }
}
