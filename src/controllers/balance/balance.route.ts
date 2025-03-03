import { Router } from "express";
import { BalanceController } from "./balance.controller";
import { routeHandler } from "../../core/route-handler";
import { validate } from "../../middleware/validate.middleware";
import { depositSchema } from "./balance.validation";

const router = Router();
const balanceController = new BalanceController();

/**
 * @route POST /balances/deposit/:userId
 * @desc Deposit money into user's balance
 * @access Private
 */
router.post(
  "/deposit/:userId",
  validate(depositSchema),
  routeHandler(balanceController.deposit.bind(balanceController))
);

export default router;
