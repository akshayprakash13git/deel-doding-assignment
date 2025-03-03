import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import logger from "../utils/logger";

/**
 * @middleware validate
 * @desc Middleware to validate request body, params, and query using Joi schemas.
 *       Ensures incoming request data is properly formatted before processing.
 * @access Public
 */
export const validate = (schema: {
  body?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
}) => {
  return (request: Request, response: Response, next: NextFunction) => {
    logger.info("In validate middleware");
    logger.debug(
      {
        body: request.body,
        params: request.params,
        query: request.query,
      },
      "request inputs"
    );
    const errors: string[] = [];

    // Validate request body
    if (schema.body) {
      const { error } = schema.body.validate(request.body);
      if (error) errors.push(...error.details.map((err) => err.message));
    }

    // Validate request params
    if (schema.params) {
      const { error } = schema.params.validate(request.params);
      if (error) errors.push(...error.details.map((err) => err.message));
    }

    // Validate request query
    if (schema.query) {
      const { error } = schema.query.validate(request.query);
      if (error) errors.push(...error.details.map((err) => err.message));
    }

    // If validation errors exist, return a structured error response
    if (errors.length > 0) {
      response.status(400).json({
        success: false,
        statusCode: 400,
        message:
          "Invalid input provided. Please check your request and try again.",
        error: errors.join(", "),
      });
    }

    next();
  };
};
