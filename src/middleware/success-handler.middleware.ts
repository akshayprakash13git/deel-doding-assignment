import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../core/api-response";
import logger from "../utils/logger";

/**
 * @middleware successHandler
 * @desc Middleware to standardize successful API responses.
 *       Ensures that all responses follow a consistent structure.
 * @access Public
 */
export const successHandler = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  console.log("In success handler", response.locals);
  const responseData: ApiResponse<any> = response.locals.responseData;

  logger.debug({ response }, "Response from response.locals");

  // If response data is missing, or headers are already sent, continue without modifying the response
  if (!responseData?.success || response.headersSent) {
    return next();
  }

  // If an error was previously set, pass it to the next middleware (errorHandler will handle it)
  if (response.locals.error) {
    return next(response.locals.error);
  }

  // Standardized API response format
  response.status(response.statusCode || 200).json({
    success: true,
    message: responseData.message || "Success",
    data: responseData.data || null,
  });
};
