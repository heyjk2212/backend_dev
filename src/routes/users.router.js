import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  usersSchema,
  userUpdateSchema,
  paramsSchema,
  usersLoginSchema,
} from "../validation/joi.js";

// import dotenv from "dotenv";
// dotenv.config();

const router = express.Router();

// const secretKey = process.env.SECRET_KEY;

// SignUp API
router.post("/signup", async (req, res, next) => {
  try {
    const validation = await usersSchema.validateAsync(req.body);
    const { loginId, password, nickname } = validation;

    const user = await prisma.users.findFirst({
      where: {
        loginId,
      },
    });

    if (user) {
      return res.status(409).json({ errorMessage: "중복된 USER ID 입니다." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.users.create({
      data: {
        loginId,
        password: hashedPassword,
        nickname,
      },
    });

    return res.status(201).json({ message: "회원가입이 완료되었습니다." });
  } catch (err) {
    next(err);
  }
});

// LogIn API
router.post("/login", async (req, res, next) => {
  try {
    const validation = await usersLoginSchema.validateAsync(req.body);
    const { loginId, password } = validation;

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

    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      return res
        .status(400)
        .json({ errorMessage: "비밀번호 형식에 일치하지 않습니다" });
    }

    const token = jwt.sign(
      {
        userId: user.userId,
      },
      // secretKey
      "customized_secret_key"
    );

    return res.status(200).json({ message: "로그인 성공" });
    // return res.status(200).json({ token: `Bearer ${token}` });
  } catch (err) {
    next(err);
  }
});

// LogOut API
router.post("/logout", authMiddleware, async (req, res, next) => {
  try {
    const token = req.headers.authorization; // 클라이언트로부터 받은 토큰

    if (!token) {
      return res.status(401).json({ message: "로그인되어 있지 않습니다." });
    }

    jwt.verify(token.split(" ")[1], secretKey, (err) => {
      if (err) {
        return res.status(401).json({ message: "잘못된 토큰입니다." });
      }

      return res.status(200).json({ message: "로그아웃이 완료되었습니다." });
    });
  } catch (error) {
    next(err);
  }
});

// API to check login status
// router.get("/checkLoginStatus", authMiddleware, async (req, res, next) => {
//   try {
//     const user = req.user;

//     if (user) {
//       const userInfo = await prisma.users.findFirst({
//         where: {
//           userId: user.userId,
//         },
//         select: {
//           userType: true,
//         },
//       });

//       return res.status(200).json({ isLoggedIn: true, userInfo });
//     } else {
//       return res
//         .status(401)
//         .json({ isLoggedIn: false, message: "사용자가 인증되지 않았습니다." });
//     }
//   } catch (err) {
//     next(err);
//   }
// });

// check users information
router.get("/usersInfo", async (req, res, next) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        userId: true,
        loginId: true,
        password: true,
        nickname: true,
      },
    });

    return res.status(200).json({ data: users });
  } catch (err) {
    next(err);
  }
});

// API for Logged-In user's information, My Page
router.get("/mypage", authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.user;

    const user = await prisma.users.findFirst({
      where: {
        userId: +userId,
      },
      select: {
        loginId: true,
        nickname: true,
        createdAt: true,
      },
    });

    return res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
});

// Logged-In user's information update API, My Page
router.patch("/mypage/:userId", authMiddleware, async (req, res, next) => {
  try {
    const validation = await userUpdateSchema.validateAsync(req.body);
    const validateParams = await paramsSchema.validateAsync(req.params);
    const { userId } = validateParams;
    const { loginId, nickname } = validation;

    await prisma.users.update({
      where: {
        userId: +userId,
      },
      data: {
        loginId,
        nickname,
      },
    });
    return res
      .status(200)
      .json({ message: "성공적으로 유저 정보를 변경하였습니다." });
  } catch (err) {
    next(err);
  }
});

export default router;
