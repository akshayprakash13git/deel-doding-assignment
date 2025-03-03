import { ContractService } from "../../src/services/contract.service";
import { Contract, sequelize } from "../../src/model";
import { Op } from "sequelize";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";

// Mock Sequelize transaction
const mockTransaction = { commit: jest.fn(), rollback: jest.fn() };

jest.mock("sequelize", () => {
  const actualSequelize = jest.requireActual("sequelize");
  return {
    ...actualSequelize,
    Sequelize: class extends actualSequelize.Sequelize {},
    Op: actualSequelize.Op,
    col: actualSequelize.col,
  };
});

jest.mock("../../src/model", () => {
  return {
    sequelize: {
      transaction: jest.fn(() => Promise.resolve(mockTransaction)),
    },
    Job: {
      findOne: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
    },
    Contract: {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    Profile: {
      findOne: jest.fn(),
      findByPk: jest.fn(),
      update: jest.fn(),
    },
  };
});

describe("ContractService", () => {
  let contractService: ContractService;
  let contractMock: DeepMockProxy<typeof Contract>;

  beforeEach(() => {
    contractService = new ContractService();
    contractMock = mockDeep<typeof Contract>();
    jest.clearAllMocks();
  });

  describe("getContractById", () => {
    it("should return a contract if found", async () => {
      const mockContract = {
        id: 1,
        ClientId: 2,
        ContractorId: 3,
        status: "in_progress",
      };

      (Contract.findOne as jest.Mock).mockResolvedValue(mockContract);

      const result = await contractService.getContractById(1, 2);

      expect(Contract.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          [Op.or]: [{ ClientId: 2 }, { ContractorId: 2 }],
        },
      });

      expect(result).toEqual(mockContract);
    });

    it("should return null if no contract is found", async () => {
      (Contract.findOne as jest.Mock).mockResolvedValue(null);

      const result = await contractService.getContractById(99, 100);

      expect(Contract.findOne).toHaveBeenCalledWith({
        where: {
          id: 99,
          [Op.or]: [{ ClientId: 100 }, { ContractorId: 100 }],
        },
      });

      expect(result).toBeNull();
    });
  });

  describe("getContracts", () => {
    it("should return all active contracts for a user", async () => {
      const mockContracts = [
        { id: 1, ClientId: 2, ContractorId: 3, status: "in_progress" },
        { id: 2, ClientId: 2, ContractorId: 4, status: "in_progress" },
      ];

      (Contract.findAll as jest.Mock).mockResolvedValue(mockContracts);

      const result = await contractService.getContracts(2);

      expect(Contract.findAll).toHaveBeenCalledWith({
        where: {
          [Op.or]: [{ ClientId: 2 }, { ContractorId: 2 }],
          status: "in_progress",
        },
        raw: true,
      });

      expect(result).toEqual(mockContracts);
    });

    it("should return an empty array if no active contracts are found", async () => {
      (Contract.findAll as jest.Mock).mockResolvedValue([]);

      const result = await contractService.getContracts(99);

      expect(Contract.findAll).toHaveBeenCalledWith({
        where: {
          [Op.or]: [{ ClientId: 99 }, { ContractorId: 99 }],
          status: "in_progress",
        },
        raw: true,
      });

      expect(result).toEqual([]);
    });
  });
});
