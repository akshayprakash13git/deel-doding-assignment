import Joi from "joi";
import DateUtils from "@utils/date-utils";

const datePattern = /^\d{2}-\d{2}-\d{4}$/;

export const bestProfessionSchema = {
  query: Joi.object({
    start: Joi.string()
      .pattern(datePattern)
      .required()
      .custom((value, helpers) => {
        try {
          return DateUtils.parseDate(value).format("YYYY-MM-DD");
        } catch (error) {
          return helpers.error("date.format");
        }
      })
      .messages({
        "date.format": `The 'start' date is invalid. Please enter valid date in DD-MM-YYYY format`,
      }),
    end: Joi.string()
      .pattern(datePattern)
      .required()
      .custom((value, helpers) => {
        try {
          return DateUtils.parseDate(value).format("YYYY-MM-DD");
        } catch (error) {
          return helpers.error("date.format");
        }
      })
      .messages({
        "date.format": `The 'end' date is invalid. Please enter valid date in DD-MM-YYYY format`,
      }),
  })
    .custom((values, helpers) => {
      if (values.start > values.end) {
        return helpers.error("date.range");
      }
      return values;
    })
    .messages({
      "date.range": `'start' date must be before 'end' date`,
    }),
};

export const bestClientsSchema = {
  query: Joi.object({
    start: Joi.string().pattern(datePattern).required().messages({
      "string.pattern.base": `"start" must be in format DD-MM-YYYY`,
    }),
    end: Joi.string().pattern(datePattern).required().messages({
      "string.pattern.base": `"end" must be in format DD-MM-YYYY`,
    }),
    limit: Joi.number().integer().min(1).default(2),
  }),
};
