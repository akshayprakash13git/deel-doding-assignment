import { Request, Response, NextFunction } from "express";
import { Profile } from "../model";
import { UnauthorizedError } from "../core/api-error";
import logger from "../utils/logger";

export interface AuthenticatedRequest extends Request {
  profile: Profile;
}

/**
 * @middleware authMiddleware
 * @desc Middleware to authenticate requests based on "profile_id" header.
 *       Attaches the authenticated user's profile to the request object.
 */
export const authMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    logger.info("In auth middleware");

    // Extract and validate profile_id from request headers
    const profileId = parseInt(request.get("profile_id") || "0", 10);
    logger.debug({ profileId }, "value from header");

    if (!profileId) {
      throw new UnauthorizedError();
    }

    // Fetch the user profile from the database
    const profile = await Profile.findOne({ where: { id: profileId } });
    logger.debug({ profile }, "profile");

    if (!profile) {
      throw new UnauthorizedError("Profile not found");
    }

    // Attach profile to request object and proceed
    (request as AuthenticatedRequest).profile = profile;
    next();
  } catch (error) {
    next(error);
  }
};
