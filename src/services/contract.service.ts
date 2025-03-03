import { Op } from "sequelize";
import { Contract } from "../model";

export class ContractService {
  /**
   * Retrieve a contract by its ID.
   * Ensures that the contract is associated with the authenticated user.
   * @param {number} id - The ID of the contract.
   * @param {number} profileId - The ID of the authenticated user.
   * @returns {Promise<Contract | null>} - The contract details if found.
   */
  async getContractById(id: number, profileId: number) {
    return await Contract.findOne({
      where: {
        id,
        [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
      },
    });
  }

  /**
   * Retrieve all active contracts for the authenticated user.
   * Filters contracts that are currently in progress.
   * @param {number} profileId - The ID of the authenticated user.
   * @returns {Promise<Contract[]>} - A list of in-progress contracts.
   */
  async getContracts(profileId: number) {
    return await Contract.findAll({
      where: {
        [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
        status: "in_progress",
      },
      raw: true,
    });
  }
}
