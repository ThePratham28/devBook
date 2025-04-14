import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

async function createDatabaseIfNotExists() {
    const adminSeque = new Sequelize(
        "postgres",
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: process.env.DB_DIALECT,
            logging: false,
        }
    );

    try {
        const [result] = await adminSeque.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            { bind: [process.env.DB_NAME] }
        );

        if (result.length === 0) {
            console.log(
                `Database ${process.env.DB_NAME} does not exist. Creating it now...`
            );
            await adminSeque.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
            console.log(
                `Database ${process.env.DB_NAME} created successfully.`
            );
        } else {
            console.log(`Database ${process.env.DB_NAME} already exists.`);
        }
    } catch (error) {
        console.error("Error checking/creating database:", error);
        throw error.message;
    } finally {
        await adminSeque.close();
    }
}

export default createDatabaseIfNotExists;
