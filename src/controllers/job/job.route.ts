import { Router } from "express";
import { JobController } from "./job.controller";
import { routeHandler } from "../../core/route-handler";
import { validate } from "../../middleware/validate.middleware";
import { getUnpaidJobsSchema, payForJobSchema } from "./job.validation";

const router = Router();
const jobController = new JobController();

/**
 * @route GET /jobs/unpaid
 * @desc Get all unpaid jobs for the authenticated user
 * @access Private
 */
router.get(
  "/unpaid",
  validate(getUnpaidJobsSchema),
  routeHandler(jobController.getUnpaidJobs.bind(jobController))
);

/**
 * @route POST /jobs/:job_id/pay
 * @desc Pay for a specific job
 * @access Private
 */
router.post(
  "/:job_id/pay",
  validate(payForJobSchema),
  routeHandler(jobController.payForJob.bind(jobController))
);

export default router;
