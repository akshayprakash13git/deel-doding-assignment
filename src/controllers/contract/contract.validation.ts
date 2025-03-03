import Joi from "joi";

export const getContractByIdSchema = {
  params: Joi.object({
    id: Joi.number().integer().positive().required(),
  }),
};

export const getContractsSchema = {};
