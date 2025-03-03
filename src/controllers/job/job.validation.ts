import Joi from "joi";

export const getUnpaidJobsSchema = {};

export const payForJobSchema = {
  params: Joi.object({
    job_id: Joi.number().integer().positive().required(),
  }),
};
