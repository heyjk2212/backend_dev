import Joi from "joi";

const usersSchema = Joi.object({
  loginId: Joi.string().min(3).max(15).alphanum().required(),
  password: Joi.string().min(4).max(20).invalid(Joi.ref("loginId")).required(),
  nickname: Joi.string().min(1).max(20).required(),
  userType: Joi.string().valid("BUYER", "SELLER").required(),
});

const usersLoginSchema = Joi.object({
  loginId: Joi.string().min(3).max(15).alphanum().required(),
  password: Joi.string().min(4).max(20).invalid(Joi.ref("loginId")).required(),
});

const userUpdateSchema = Joi.object({
  loginId: Joi.string().min(3).max(15).alphanum(),
  nickname: Joi.string().min(1).max(20),
  userType: Joi.string().valid("BUYER", "SELLER"),
});

const paramsSchema = Joi.object({
  userId: Joi.number().integer().required(),
});

export { usersSchema, userUpdateSchema, paramsSchema, usersLoginSchema };
