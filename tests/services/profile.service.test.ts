import ProfileService from "../../src/services/profile.service";
import { Job, Contract, Profile, sequelize } from "../../src/model";
import { Op, Sequelize } from "sequelize";

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

describe("ProfileService", () => {
  let profileService: ProfileService;

  beforeEach(() => {
    profileService = new ProfileService();
    jest.clearAllMocks();
  });

  describe("getBestProfession", () => {
    it("should return the profession that earned the most in the given time range", async () => {
      const mockResult = {
        profession: "Software Engineer",
        totalEarned: 5000,
      };

      (Job.findOne as jest.Mock).mockResolvedValue(mockResult);

      const result = await profileService.getBestProfession(
        "2024-01-01",
        "2024-02-01"
      );

      expect(Job.findOne).toHaveBeenCalledWith({
        attributes: [
          [Sequelize.col("Contract.Contractor.profession"), "profession"],
          [Sequelize.fn("SUM", Sequelize.col("price")), "totalEarned"],
        ],
        include: [
          {
            model: Contract,
            as: "Contract",
            attributes: [],
            where: { status: "in_progress" },
            include: [
              {
                model: Profile,
                as: "Contractor",
                attributes: [],
              },
            ],
          },
        ],
        where: {
          paid: true,
          paymentDate: { [Op.between]: ["2024-01-01", "2024-02-01"] },
        },
        group: ["Contract.Contractor.profession"],
        order: [[Sequelize.literal("totalEarned"), "DESC"]],
        raw: true,
      });

      expect(result).toEqual(mockResult);
    });

    it("should return null if no profession is found", async () => {
      (Job.findOne as jest.Mock).mockResolvedValue(null);

      const result = await profileService.getBestProfession(
        "2024-01-01",
        "2024-02-01"
      );

      expect(result).toBeNull();
    });
  });

  describe("getBestClients", () => {
    it("should return a list of top-paying clients", async () => {
      const mockResults = [
        { id: 1, fullName: "John Doe", paid: 5000 },
        { id: 2, fullName: "Jane Smith", paid: 3000 },
      ];

      (Job.findAll as jest.Mock).mockResolvedValue(mockResults);

      const result = await profileService.getBestClients(
        "2024-01-01",
        "2024-02-01",
        2
      );

      expect(Job.findAll).toHaveBeenCalledWith({
        attributes: [
          [Sequelize.col("Contract.Client.id"), "id"],
          [
            Sequelize.literal(
              "`Contract->Client`.`firstName` || ' ' || `Contract->Client`.`lastName`"
            ),
            "fullName",
          ],
          [Sequelize.fn("SUM", Sequelize.col("price")), "paid"],
        ],
        include: [
          {
            model: Contract,
            as: "Contract",
            attributes: [],
            where: { status: "in_progress" },
            include: [
              {
                model: Profile,
                as: "Client",
                attributes: [],
              },
            ],
          },
        ],
        where: {
          paid: true,
          paymentDate: { [Op.between]: ["2024-01-01", "2024-02-01"] },
        },
        group: ["Contract.Client.id"],
        order: [[Sequelize.literal("paid"), "DESC"]],
        limit: 2,
        raw: true,
      });

      expect(result).toEqual(mockResults);
    });

    it("should return an empty array if no clients are found", async () => {
      (Job.findAll as jest.Mock).mockResolvedValue([]);

      const result = await profileService.getBestClients(
        "2024-01-01",
        "2024-02-01",
        2
      );

      expect(result).toEqual([]);
    });
  });
});
