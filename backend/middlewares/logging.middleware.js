import logger from "../utils/logger.js";

const requestLogger = (req, res, next) => {
    logger.info(`Incoming Request: ${req.method} ${req.url}`);
    res.on("finish", () => {
        logger.info(`Response: ${res.statusCode} ${req.method} ${req.url}`);
    });
    next();
};

export default requestLogger;
