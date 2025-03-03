import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite3",
});
console.log("Sequelize instance created");
export default sequelize;
