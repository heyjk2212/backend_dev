import express from "express";
import { prisma } from "../utils/prisma/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// SignUp API
router.post("/signup", async (req, res, next) => {
  try {
    const { loginId, password, nickname, userType } = req.body;

    const user = await prisma.users.findFirst({
      where: {
        loginId,
      },
    });

    if (user) {
      return res.status(409).json({ errorMessage: "중복된 USER ID 입니다." });
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.users.create({
      data: {
        loginId,
        password: hashedPassword,
        nickname,
        userType,
      },
    });

    return res.status(201).json({ message: "회원가입이 완료되었습니다." });
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .json({ errorMessage: "서버에서 에러가 발생하였습니다." });
  }
});

// LogIn API
router.post("/login", async (req, res, next) => {
  try {
    const { loginId, password } = req.body;

    const user = await prisma.users.findFirst({
      where: {
        loginId,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ errorMessage: "존재하지 않는 USER ID 입니다." });
    }

    // 비밀번호 일치하는지 확인
    const result = await bcrypt.compare(password, user.password);

    // 검증에 실패할 경우
    if (!result) {
      return res
        .status(400)
        .json({ errorMessage: "비밀번호 형식에 일치하지 않습니다" });
    }

    // 로그인 성공했을 시 JWT 토큰 발급
    const token = await jwt.sign(
      {
        userId: user.userId,
      },
      "customized_secret_key"
    );

    // 쿠키 발급
    res.cookie("authorization", `Bearer ${token}`);

    return res.status(200).json({ message: "로그인에 성공하였습니다." });
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .json({ errorMessage: "서버에서 에러가 발생하였습니다." });
  }
});

// LogOut API
router.post("/logout", async (req, res, next) => {
  try {
    res.clearCookie("authorization");

    return res.status(200).json({ errorMessage: "로그아웃 되었습니다." });
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .json({ errorMessage: "서버에서 에러가 발생하였습니다." });
  }
});

export default router;
