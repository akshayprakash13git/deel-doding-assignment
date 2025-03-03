import { Sequelize } from "sequelize";
import logger from "@utils/logger";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite3",
});
logger.info("Sequelize instance created");
export default sequelize;
