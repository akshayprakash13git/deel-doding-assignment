import { Request } from "express";
import TransactionService from "@services/transaction.service";
import { ApiResponse } from "@core/api-response";
import logger from "@utils/logger";

export class BalanceController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  /**
   * Deposits money into the user's balance.
   *
   * @param {Request} request - Express request object containing userId in params and amount in body.
   * @returns {Promise<ApiResponse<any>>} - API response with deposit result.
   */
  async deposit(request: Request): Promise<ApiResponse<any>> {
    logger.info("Inside the controller function");

    const userId = Number(request.params.userId);
    const amount = request.body.amount;
    logger.debug({ userId, amount }, "user inputs | deposit");

    const result = await this.transactionService.depositBalance(userId, amount);

    return {
      message: "Balance deposited successfully",
      data: result.data,
    };
  }
}
