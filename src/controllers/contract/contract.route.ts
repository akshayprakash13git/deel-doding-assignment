import { Router } from "express";
import { ContractController } from "./contract.controller";
import { routeHandler } from "../../core/route-handler";
import { validate } from "../../middleware/validate.middleware";
import {
  getContractByIdSchema,
  getContractsSchema,
} from "./contract.validation";

const router = Router();
const contractController = new ContractController();

/**
 * @route GET /contracts/:id
 * @desc Get a contract by its ID (Only if user is associated with it)
 * @access Private
 */
router.get(
  "/:id",
  validate(getContractByIdSchema),
  routeHandler(contractController.getContractById.bind(contractController))
);

/**
 * @route GET /contracts
 * @desc Get all contracts for the authenticated user
 * @access Private
 */
router.get(
  "/",
  validate(getContractsSchema),
  routeHandler(contractController.getContracts.bind(contractController))
);

export default router;
