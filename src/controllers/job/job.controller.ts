import JobService from "../../services/job.service";
import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import { ApiResponse } from "../../core/api-response";
import TransactionService from "../../services/transaction.service";
import logger from "../../utils/logger";

export class JobController {
  private transactionService: TransactionService;
  private jobService: JobService;

  constructor() {
    this.transactionService = new TransactionService();
    this.jobService = new JobService();
  }

  /**
   * Retrieves all unpaid jobs for the authenticated user.
   *
   * @param {AuthenticatedRequest} request - The request object containing the authenticated user's profile.
   * @returns {Promise<ApiResponse<any>>} - A response containing the list of unpaid jobs.
   */
  async getUnpaidJobs(
    request: AuthenticatedRequest
  ): Promise<ApiResponse<any>> {
    logger.info("Inside the controller function");

    const jobs = await this.jobService.getUnpaidJobs(request.profile.id);

    return {
      data: jobs,
    };
  }

  /**
   * Processes payment for a specific job.
   *
   * @param {AuthenticatedRequest} request - The request object containing the authenticated user's profile.
   * @returns {Promise<ApiResponse<any>>} - A response confirming the payment.
   */
  async payForJob(request: AuthenticatedRequest): Promise<ApiResponse<any>> {
    logger.info("Inside the controller function");

    const jobId = parseInt(request.params.job_id, 10);
    logger.debug({ jobId }, "user input | payForJob");
    await this.transactionService.payForJob(request.profile.id, jobId);

    return {
      message: "Payment successful",
    };
  }
}
