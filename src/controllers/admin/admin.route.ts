import { Router } from "express";
import { AdminController } from "./admin.controller";
import { routeHandler } from "../../core/route-handler";
import { validate } from "../../middleware/validate.middleware";
import { bestProfessionSchema, bestClientsSchema } from "./admin.validation";

const router = Router();
const adminController = new AdminController();

/**
 * @route GET /admin/best-profession
 * @desc Retrieves the profession that earned the most within a given time period.
 * @access Private
 */
router.get(
  "/best-profession",
  validate(bestProfessionSchema),
  routeHandler(adminController.getBestProfession.bind(adminController))
);

/**
 * GET /admin/best-clients
 * Retrieves the top-paying clients within a given time period.
 * @access Private
 */
router.get(
  "/best-clients",
  validate(bestClientsSchema),
  routeHandler(adminController.getBestClients.bind(adminController))
);

export default router;
