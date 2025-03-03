import { Contract, Job, Profile, sequelize } from "../model";
import { BadRequestError, InsufficientBalanceError } from "../core/api-error";

class TransactionService {
  /**
   * Process payment for a specific job.
   * Ensures the job belongs to the authenticated client, is unpaid, and that the client has sufficient balance.
   * Deducts the payment from the client's balance and transfers it to the contractor.
   * @param {number} clientId - The ID of the authenticated client.
   * @param {number} jobId - The ID of the job to be paid.
   * @returns {Promise<{ job: Job; client: Profile; contractor: Profile }>} - The updated job, client, and contractor details.
   * @throws {BadRequestError} - If the job is not found or has already been paid.
   * @throws {InsufficientBalanceError} - If the client does not have enough balance to pay for the job.
   */
  async payForJob(clientId: number, jobId: number) {
    const transaction = await sequelize.transaction();
    try {
      const job = await Job.findOne({
        where: { id: jobId, paid: false },
        include: { model: Contract, where: { ClientId: clientId } },
        transaction,
      });
      if (!job) {
        throw new BadRequestError("Job not found or already paid");
      }

      const client = await Profile.findByPk(clientId, { transaction });
      const contractor = await Profile.findByPk(job.Contract.ContractorId, {
        transaction,
      });

      if (client.balance < job.price) {
        throw new InsufficientBalanceError();
      }

      client.balance -= job.price;
      contractor.balance += job.price;
      job.paid = true;
      job.paymentDate = new Date();

      await client.save({ transaction });
      await contractor.save({ transaction });
      await job.save({ transaction });

      await transaction.commit();
      return { job, client, contractor };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Deposit funds into the client's balance.
   * Ensures the deposit does not exceed 25% of the total unpaid jobs.
   * @param {number} userId - The ID of the client making the deposit.
   * @param {number} amount - The amount to deposit.
   * @returns {Promise<{ success: boolean; data: Profile }>} - The updated client profile with the new balance.
   * @throws {BadRequestError} - If the user is not a client or the deposit exceeds the allowed limit.
   */
  async depositBalance(userId: number, amount: number) {
    const transaction = await sequelize.transaction();
    try {
      const client = (await Profile.findOne({
        where: { id: userId, type: "client" },
        transaction,
      })) as Profile | null;

      if (!client) {
        throw new BadRequestError("Invalid user type");
      }

      // Get total unpaid jobs amount
      const unpaidJobs = await Job.findAll({
        where: { paid: false },
        include: {
          association: "Contract",
          where: { ClientId: userId },
        },
        transaction,
      });

      const totalUnpaid = unpaidJobs.reduce(
        (sum: number, job: Job) => sum + job.price,
        0
      );
      const maxDeposit = totalUnpaid * 0.25;

      if (amount > maxDeposit) {
        throw new BadRequestError(
          `Deposit exceeds 25% of total unpaid jobs (${maxDeposit})`
        );
      }
      client.balance += amount;
      await client.save({ transaction });
      await transaction.commit();

      return { success: true, data: client };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
export default TransactionService;
