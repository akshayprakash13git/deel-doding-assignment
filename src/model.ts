const Sequelize = require("sequelize");

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite3",
});

// Define Profile model
class Profile extends Sequelize.Model {}
Profile.init(
  {
    firstName: { type: Sequelize.STRING, allowNull: false },
    lastName: { type: Sequelize.STRING, allowNull: false },
    profession: { type: Sequelize.STRING, allowNull: false },
    balance: { type: Sequelize.DECIMAL(12, 2) },
    type: { type: Sequelize.ENUM("client", "contractor") },
  },
  { sequelize, modelName: "Profile" }
);

// Define Contract model
class Contract extends Sequelize.Model {}
Contract.init(
  {
    terms: { type: Sequelize.TEXT, allowNull: false },
    status: { type: Sequelize.ENUM("new", "in_progress", "terminated") },
  },
  { sequelize, modelName: "Contract" }
);

// Define Job model
class Job extends Sequelize.Model {}
Job.init(
  {
    description: { type: Sequelize.TEXT, allowNull: false },
    price: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
    paid: { type: Sequelize.BOOLEAN, defaultValue: false },
    paymentDate: { type: Sequelize.DATE },
  },
  { sequelize, modelName: "Job" }
);

// Define relationships
Profile.hasMany(Contract, { as: "Contractor", foreignKey: "ContractorId" });
Contract.belongsTo(Profile, { as: "Contractor" });

Profile.hasMany(Contract, { as: "Client", foreignKey: "ClientId" });
Contract.belongsTo(Profile, { as: "Client" });

Contract.hasMany(Job);
Job.belongsTo(Contract);

export { sequelize, Profile, Contract, Job };
