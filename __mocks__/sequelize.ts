import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";
import { Sequelize } from "sequelize";
import { sequelize, Profile, Contract, Job } from "../src/model";

// Mock the models and sequelize instance
jest.mock("../src/model", () => ({
  sequelize: mockDeep<Sequelize>(),
  Profile: mockDeep<typeof Profile>(),
  Contract: mockDeep<typeof Contract>(),
  Job: mockDeep<typeof Job>(),
}));

// Ensure Op is correctly included in the mock
jest.mock("sequelize", () => {
  const actualSequelize = jest.requireActual("sequelize");
  return {
    ...actualSequelize,
    Sequelize: class extends actualSequelize.Sequelize {},
    Op: { ...actualSequelize.Op },
    col: { ...actualSequelize.col },
  };
});

// Export the mocked instances for test usage
export const sequelizeMock = sequelize as unknown as DeepMockProxy<Sequelize>;
export const profileMock = Profile as unknown as DeepMockProxy<typeof Profile>;
export const contractMock = Contract as unknown as DeepMockProxy<
  typeof Contract
>;
export const jobMock = Job as unknown as DeepMockProxy<typeof Job>;

/**
 * Reset all mocks before each test
 */
beforeEach(() => {
  mockReset(sequelizeMock);
  mockReset(profileMock);
  mockReset(contractMock);
  mockReset(jobMock);
});
