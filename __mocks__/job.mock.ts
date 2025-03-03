import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import { Job } from "../src/model";

export const jobMock = mockDeep<typeof Job>();

// Mock the `findOne` method to return a fake job
jobMock.findOne.mockResolvedValue({
  id: 1,
  description: "Fix server issue",
  price: 200.0,
  paid: false,
  paymentDate: null,
  ContractId: 1,
  save: jest.fn(),
} as unknown as Job);

// Mock the `findAll` method to return an array of fake jobs
jobMock.findAll.mockResolvedValue([
  {
    id: 1,
    description: "Fix server issue",
    price: 200.0,
    paid: false,
    paymentDate: null,
    ContractId: 1,
  },
  {
    id: 2,
    description: "Develop new feature",
    price: 500.0,
    paid: true,
    paymentDate: new Date(),
    ContractId: 2,
  },
] as unknown as Job[]);

// Mock the `create` method to return a new job instance
jobMock.create.mockImplementation(async (jobData: any) => {
  return {
    id: Math.floor(Math.random() * 1000),
    ...jobData,
    save: jest.fn(),
  } as unknown as Job;
});

// Mock the `update` method to simulate updating a job
jobMock.update.mockImplementation(async () => {
  return [1];
});

// Mock the `destroy` method to simulate deleting a job
jobMock.destroy.mockResolvedValue(1);
