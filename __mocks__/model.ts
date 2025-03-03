import SequelizeMock from "sequelize-mock";

// Create a mocked Sequelize instance
const sequelizeMock = new SequelizeMock();

// Define mock models
const ProfileMock = sequelizeMock.define("Profile", {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  balance: 200,
  type: "client",
});

const ContractMock = sequelizeMock.define("Contract", {
  id: 1,
  terms: "Some contract terms",
  status: "in_progress",
  ClientId: 1,
});

const JobMock = sequelizeMock.define("Job", {
  id: 1,
  description: "Test job",
  price: 100,
  paid: null,
  paymentDate: null,
  ContractId: 1,
});

// Set up relationships
ProfileMock.hasMany(ContractMock, { foreignKey: "ClientId" });
ContractMock.belongsTo(ProfileMock, { foreignKey: "ClientId" });

ContractMock.hasMany(JobMock);
JobMock.belongsTo(ContractMock);

export {
  sequelizeMock as sequelize,
  ProfileMock as Profile,
  ContractMock as Contract,
  JobMock as Job,
};
