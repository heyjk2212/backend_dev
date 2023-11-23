import Joi from "joi";

const usersSchema = Joi.object({
  loginId: Joi.string().min(3).max(15).alphanum().required(),
  password: Joi.string().min(4).max(20).invalid(Joi.ref("loginId")).required(),
  nickname: Joi.string().min(1).max(20).required(),
});

const usersLoginSchema = Joi.object({
  loginId: Joi.string().min(3).max(15).alphanum().required(),
  password: Joi.string().min(4).max(20).invalid(Joi.ref("loginId")).required(),
});

const userUpdateSchema = Joi.object({
  loginId: Joi.string().min(3).max(15).alphanum(),
  nickname: Joi.string().min(1).max(20),
});

const paramsSchema = Joi.object({
  userId: Joi.number().integer().required(),
});

const goodsSchema = Joi.object({
  goodsName: Joi.string().min(1).max(10).required(),
  imageUrl: Joi.string().required(),
  price: Joi.number().integer().required(),
  content: Joi.string().required(),
});

const commentsSchema = Joi.object({
  comment: Joi.required(),
});

export {
  usersSchema,
  userUpdateSchema,
  paramsSchema,
  goodsSchema,
  commentsSchema,
  usersLoginSchema,
};
