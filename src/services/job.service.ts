import { Op } from "sequelize";
import { Job, Contract } from "../model";

class JobService {
  /**
   * Retrieve all unpaid jobs for the authenticated user.
   * Jobs are considered unpaid if they are not marked as paid.
   * @param {number} profileId - The ID of the authenticated user.
   * @returns {Promise<Job[]>} - A list of unpaid jobs associated with the user.
   */
  async getUnpaidJobs(profileId: number) {
    return await Job.findAll({
      where: {
        paid: false,
      },
      include: [
        {
          model: Contract,
          where: {
            status: "in_progress",
            [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
          },
        },
      ],
    });
  }
}
export default JobService;
