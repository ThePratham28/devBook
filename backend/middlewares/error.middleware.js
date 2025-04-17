import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
    logger.error(`Error: ${err.message} | Stack: ${err.stack}`);

    const statusCode = err.statusCode || 500;
    const response = {
        success: false,
        message: err.message || "Internal Server Error",
    };

    if (process.env.NODE_ENV === "development") {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

export default errorHandler;
