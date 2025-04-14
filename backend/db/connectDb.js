import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import createDatabaseIfNotExists from "../utils/createDBifnotexists.js";
dotenv.config();

let sequelize;

if (process.env.NODE_ENV == "development") {
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
} else {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: "postgres",
        protocol: "postgres",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false, // Required for Render's managed PostgreSQL
            },
        },
    });
}

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully");

        await sequelize.sync({ alter: false });
        console.log("Database synchronized successfully");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
        process.exit(1);
    }
};

export default sequelize;
