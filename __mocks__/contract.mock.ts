import { mockDeep } from "jest-mock-extended";
import { Contract } from "../src/model";

export const contractMock = mockDeep<typeof Contract>();

// Mock the `findOne` method to return a fake contract
contractMock.findOne.mockResolvedValue({
  id: 1,
  terms: "Standard freelance agreement",
  status: "in_progress",
  ContractorId: 2,
  ClientId: 3,
  save: jest.fn(),
} as unknown as Contract);

// Mock the `findAll` method to return an array of fake contracts
contractMock.findAll.mockResolvedValue([
  {
    id: 1,
    terms: "Standard freelance agreement",
    status: "in_progress",
    ContractorId: 2,
    ClientId: 3,
  },
  {
    id: 2,
    terms: "Extended service contract",
    status: "new",
    ContractorId: 4,
    ClientId: 5,
  },
] as unknown as Contract[]);

// Mock the `create` method to return a new contract instance
contractMock.create.mockImplementation(async (contractData: any) => {
  return {
    id: Math.floor(Math.random() * 1000),
    ...contractData,
    save: jest.fn(),
  } as unknown as Contract;
});

// Mock the `update` method to simulate updating a contract
contractMock.update.mockImplementation(async () => {
  return [1];
});

// Mock the `destroy` method to simulate deleting a contract
contractMock.destroy.mockResolvedValue(1);
