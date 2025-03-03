import { Request, Response, NextFunction } from "express";
import { ApiError } from "../core/api-error";
import logger from "../utils/logger";

/**
 * @middleware errorHandler
 * @desc Global error-handling middleware to standardize API error responses.
 *       Captures and formats known and unknown errors before sending responses.
 */
export const errorHandler = (
  err: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  logger.info("In error handler");
  logger.error("Error:", err);

  // Handle custom API errors
  if (err instanceof ApiError) {
    response.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err.details || null,
    });
    return;
  }

  // Handle unexpected errors
  response.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
};
