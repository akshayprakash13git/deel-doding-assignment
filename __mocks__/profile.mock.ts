import { mockDeep } from "jest-mock-extended";
import { Profile } from "../src/model";

export const profileMock = mockDeep<typeof Profile>();

// Mock the `findOne` method to return a fake profile
profileMock.findOne.mockImplementation(async (query: any) => {
  if (query.where.id === 1) {
    return {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      profession: "Software Engineer",
      balance: 1000.0,
      type: "client",
      save: jest.fn(),
    } as unknown as Profile;
  }
  return null;
});

// Mock the `findAll` method to return an array of fake profiles
profileMock.findAll.mockResolvedValue([
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    profession: "Software Engineer",
    balance: 1000.0,
    type: "client",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    profession: "Graphic Designer",
    balance: 500.0,
    type: "contractor",
  },
] as unknown as Profile[]);

// Mock the `create` method to return a new profile instance
profileMock.create.mockImplementation(async (profileData: any) => {
  return {
    id: Math.floor(Math.random() * 1000),
    ...profileData,
    save: jest.fn(),
  } as unknown as Profile;
});

// Mock the `update` method to simulate updating a profile
profileMock.update.mockImplementation(async () => {
  return [1];
});

// Mock the `destroy` method to simulate deleting a profile
profileMock.destroy.mockResolvedValue(1);
