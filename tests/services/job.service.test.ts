import JobService from "../../src/services/job.service";
import { Job, Contract, sequelize } from "../../src/model";
import { Op } from "sequelize";

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

describe("JobService", () => {
  let jobService: JobService;

  beforeEach(() => {
    jobService = new JobService();
    jest.clearAllMocks();
  });

  describe("getUnpaidJobs", () => {
    it("should return a list of unpaid jobs for a user", async () => {
      const mockJobs = [
        {
          id: 1,
          description: "Fix server issue",
          paid: null,
          Contract: { id: 10, status: "in_progress", ClientId: 2 },
        },
        {
          id: 2,
          description: "Develop API",
          paid: null,
          Contract: { id: 11, status: "in_progress", ContractorId: 2 },
        },
      ];

      (Job.findAll as jest.Mock).mockResolvedValue(mockJobs);

      const result = await jobService.getUnpaidJobs(2);

      expect(Job.findAll).toHaveBeenCalledWith({
        where: {
          paid: false,
        },
        include: [
          {
            model: Contract,
            where: {
              status: "in_progress",
              [Op.or]: [{ ClientId: 2 }, { ContractorId: 2 }],
            },
          },
        ],
      });

      expect(result).toEqual(mockJobs);
    });

    it("should return an empty array if no unpaid jobs are found", async () => {
      (Job.findAll as jest.Mock).mockResolvedValue([]);

      const result = await jobService.getUnpaidJobs(99);

      expect(Job.findAll).toHaveBeenCalledWith({
        where: {
          paid: false,
        },
        include: [
          {
            model: Contract,
            where: {
              status: "in_progress",
              [Op.or]: [{ ClientId: 99 }, { ContractorId: 99 }],
            },
          },
        ],
      });

      expect(result).toEqual([]);
    });
  });
});
