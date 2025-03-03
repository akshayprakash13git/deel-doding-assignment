import Joi from "joi";

export const depositSchema = {
  params: Joi.object({
    userId: Joi.number().integer().positive().required(),
  }),
  body: Joi.object({
    amount: Joi.number().positive().required(),
  }),
};
