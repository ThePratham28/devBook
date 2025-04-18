import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import createDatabaseIfNotExists from "../utils/createDBifnotexists.js";
import logger from "../utils/logger.js";
dotenv.config();

let sequelize;

await createDatabaseIfNotExists();

sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
        port: process.env.DB_PORT || 5432,
        logging: false,
    }
);

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        logger.info("Database connected successfully");

        await sequelize.sync({ alter: false });
        logger.info("Database synchronized successfully");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        process.exit(1);
    }
};

export default sequelize;
