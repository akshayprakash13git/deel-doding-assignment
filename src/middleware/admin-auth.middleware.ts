import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware";
import { UnauthorizedError } from "../core/api-error";

/**
 * @middleware adminAuthMiddleware
 * @desc Middleware to authorize admin users.
 *       Ensures the authenticated user has an admin profile before proceeding.
 *       Should be used after `authMiddleware` to guarantee authentication.
 */
export const adminAuthMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    // @todo to check if a layer of admin verification is required for admin routes. Requirement not clear on this, uncomment if you want to use

    /*const { profile } = request as AuthenticatedRequest;
    // Check if the user is an admin
    if (profile.type !== "admin") {
      throw new UnauthorizedError("Admin access required");
    }*/

    next();
  } catch (error) {
    next(error);
  }
};
