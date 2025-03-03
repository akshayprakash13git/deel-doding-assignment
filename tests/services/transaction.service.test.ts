import TransactionService from "../../src/services/transaction.service";
import {
  BadRequestError,
  InsufficientBalanceError,
} from "../../src/core/api-error";
import { Op } from "sequelize";
import { sequelize, Job, Profile } from "../../src/model";

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

describe("TransactionService", () => {
  let transactionService: TransactionService;

  beforeEach(() => {
    transactionService = new TransactionService();
    jest.clearAllMocks();
    (sequelize.transaction as jest.Mock).mockResolvedValue(mockTransaction);
  });

  describe("payForJob", () => {
    it("should successfully process a job payment", async () => {
      const mockJob = {
        id: 1,
        price: 100,
        paid: null,
        save: jest.fn(),
        Contract: { ContractorId: 2 },
      };
      const mockClient = { id: 1, balance: 200, save: jest.fn() };
      const mockContractor = { id: 2, balance: 50, save: jest.fn() };

      (Job.findOne as jest.Mock).mockResolvedValue(mockJob);
      (Profile.findByPk as jest.Mock)
        .mockResolvedValueOnce(mockClient)
        .mockResolvedValueOnce(mockContractor);

      const result = await transactionService.payForJob(1, 1);

      expect(sequelize.transaction).toHaveBeenCalled();
      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(mockTransaction.rollback).not.toHaveBeenCalled();
    });

    it("should throw BadRequestError if the job is not found or already paid", async () => {
      (Job.findOne as jest.Mock).mockResolvedValue(null);

      await expect(transactionService.payForJob(1, 1)).rejects.toThrow(
        BadRequestError
      );
      expect(mockTransaction.rollback).toHaveBeenCalled();
    });

    it("should throw InsufficientBalanceError if the client has insufficient funds", async () => {
      const mockJob = {
        id: 1,
        price: 100,
        paid: null,
        Contract: { ContractorId: 2 },
      };
      const mockClient = { id: 1, balance: 50 };

      (Job.findOne as jest.Mock).mockResolvedValue(mockJob);
      (Profile.findByPk as jest.Mock)
        .mockResolvedValueOnce(mockClient)
        .mockResolvedValueOnce({ id: 2, balance: 50 });

      await expect(transactionService.payForJob(1, 1)).rejects.toThrow(
        InsufficientBalanceError
      );
      expect(mockTransaction.rollback).toHaveBeenCalled();
    });
  });

  describe("depositBalance", () => {
    it("should successfully deposit funds within limit", async () => {
      const mockClient = {
        id: 1,
        type: "client",
        balance: 100,
        save: jest.fn(),
      };
      const mockJobs = [{ price: 400 }, { price: 200 }]; // Total unpaid: 600, max deposit: 150

      (Profile.findOne as jest.Mock).mockResolvedValue(mockClient);
      (Job.findAll as jest.Mock).mockResolvedValue(mockJobs);

      const result = await transactionService.depositBalance(1, 100);

      expect(Profile.findOne).toHaveBeenCalledWith({
        where: { id: 1, type: "client" },
        transaction: mockTransaction,
      });
      expect(Job.findAll).toHaveBeenCalledWith({
        where: { paid: false },
        include: { association: "Contract", where: { ClientId: 1 } },
        transaction: mockTransaction,
      });
      expect(mockClient.balance).toBe(200);
      expect(mockClient.save).toHaveBeenCalledWith({
        transaction: mockTransaction,
      });
      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(result).toEqual({ success: true, data: mockClient });
    });

    it("should throw BadRequestError if the user is not a client", async () => {
      (Profile.findOne as jest.Mock).mockResolvedValue(null);

      await expect(transactionService.depositBalance(1, 100)).rejects.toThrow(
        BadRequestError
      );
      expect(mockTransaction.rollback).toHaveBeenCalled();
    });

    it("should throw BadRequestError if deposit exceeds 25% of total unpaid jobs", async () => {
      const mockClient = {
        id: 1,
        type: "client",
        balance: 100,
        save: jest.fn(),
      };
      const mockJobs = [{ price: 100 }, { price: 100 }]; // Total unpaid: 200, max deposit: 50

      (Profile.findOne as jest.Mock).mockResolvedValue(mockClient);
      (Job.findAll as jest.Mock).mockResolvedValue(mockJobs);

      await expect(transactionService.depositBalance(1, 100)).rejects.toThrow(
        BadRequestError
      );
      expect(mockTransaction.rollback).toHaveBeenCalled();
    });
  });
});
