import { AuthenticatedRequest } from "../../middleware/auth.middleware";
import { ContractService } from "../../services/contract.service";
import { BadRequestError } from "../../core/api-error";
import { ApiResponse } from "../../core/api-response";
import logger from "../../utils/logger";

export class ContractController {
  private contractService: ContractService;

  constructor() {
    this.contractService = new ContractService();
  }

  /**
   * Retrieve a contract by its ID.
   * Ensures that the contract belongs to the authenticated user.
   * @param {AuthenticatedRequest} request - The authenticated request containing the profile and contract ID.
   * @returns {Promise<ApiResponse<any>>} - The contract details if found.
   * @throws {BadRequestError} - If the contract is not found or access is denied.
   */
  async getContractById(
    request: AuthenticatedRequest
  ): Promise<ApiResponse<any>> {
    logger.info("Inside the controller function");
    logger.debug(
      { currentUser: request.profile },
      "current user | getContractById"
    );

    const contractId = parseInt(request.params.id, 10);
    logger.debug(
      { contractId, currentUser: request.profile },
      "user inputs | getContractById"
    );

    const contract = await this.contractService.getContractById(
      contractId,
      request.profile.id
    );

    if (!contract)
      throw new BadRequestError("Contract not found or access denied");

    return {
      data: contract,
    };
  }

  /**
   * Retrieve all contracts associated with the authenticated profile.
   * @param {AuthenticatedRequest} request - The authenticated request containing the profile.
   * @returns {Promise<ApiResponse<any>>} - The list of contracts.
   */
  async getContracts(request: AuthenticatedRequest): Promise<ApiResponse<any>> {
    logger.info("Inside the controller function");

    const contracts = await this.contractService.getContracts(
      request.profile.id
    );
    logger.debug(
      { currentUser: request.profile },
      "current user | getContracts"
    );

    return {
      data: contracts,
    };
  }
}
