import { Request } from "express";
import ProfileService from "@services/profile.service";
import { ApiResponse } from "@core/api-response";
import DateUtils from "@utils/date-utils";
import logger from "@utils/logger";

export class AdminController {
  private profileService: ProfileService;

  constructor() {
    this.profileService = new ProfileService();
  }

  /**
   * Retrieves the profession that earned the most within a given time period.
   * Assumes `start` and `end` are validated via middleware.
   * @param request - Express request object with validated query params (`start`, `end`).
   * @returns {Promise<ApiResponse<any>>} - API response with the top profession.
   */
  async getBestProfession(request: Request): Promise<ApiResponse<any>> {
    logger.info("Inside the controller function");

    const { start, end } = request.query as { start: string; end: string };
    logger.debug({ start, end }, "input query params | getBestProfession");

    const startDate = DateUtils.formatStartOfDay(start);
    const endDate = DateUtils.formatEndOfDay(end);
    logger.debug(
      { startDate, endDate },
      "dates after conversion | getBestProfession"
    );

    const profession = await this.profileService.getBestProfession(
      startDate,
      endDate
    );
    return {
      data: profession || {},
    };
  }

  /**
   * Retrieves the top-paying clients within a given time period.
   * Assumes `start`, `end`, and `limit` are validated via middleware.
   * @param request - Express request object with validated query params (`start`, `end`, `limit`).
   * @returns {Promise<ApiResponse<any>>} - API response with the top clients.
   */
  async getBestClients(request: Request): Promise<ApiResponse<any>> {
    logger.info("Inside the controller function");

    const {
      start,
      end,
      limit = 2,
    } = request.query as {
      start: string;
      end: string;
      limit: string;
    };
    logger.debug({ start, end, limit }, "input query params | getBestClients");

    const startDate = DateUtils.formatStartOfDay(start);
    const endDate = DateUtils.formatEndOfDay(end);
    logger.debug(
      { startDate, endDate },
      "dates after conversion | getBestClients"
    );

    const clients = await this.profileService.getBestClients(
      startDate,
      endDate,
      Number(limit)
    );

    return {
      data: clients,
    };
  }
}
