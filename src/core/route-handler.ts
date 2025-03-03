import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { ApiResponse } from "./api-response";
import logger from "@utils/logger";

/**
 * Middleware wrapper to handle async controller functions.
 * Ensures standardized API responses and error propagation.
 * @template T - The type of data returned by the controller function.
 * @param {Function} controllerFunction - The controller function that processes the request.
 * @returns {Function} - An Express middleware function.
 */
export const routeHandler = <T>(
  controllerFunction: (request: AuthenticatedRequest) => Promise<ApiResponse<T>>
) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const authReq = request as AuthenticatedRequest;
      const controllerResponse = await controllerFunction(authReq);

      // Store the response in response.locals for further processing (e.g., in successHandler middleware)
      response.locals.responseData = ApiResponse.from(controllerResponse);
      next();
    } catch (error) {
      logger.error("Error in routeHandler:", error);
      next(error);
    }
  };
};
