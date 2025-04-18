// Importing dependencies
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Importing local modules
import { connectDB } from "./db/connectDb.js";
import logger from "./utils/logger.js";
import authRoutes from "./routes/authRoutes.js";
import bookmarkRoutes from "./routes/bookmark.routes.js";
import tagRoutes from "./routes/tag.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import noteRoutes from "./routes/note.routes.js";
import errorHandler from "./middlewares/error.middleware.js";
import "./config/passport.config.js";
import requestLogger from "./middlewares/logging.middleware.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        },
    })
);

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 500, // Limit each IP to 100 requests per windowMs
        message: "Too many requests, please try again later.",
    })
);

app.use(helmet());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(requestLogger);

// Swagger setup
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Bookmark Manager API",
            version: "1.0.0",
            description: "API documentation for the Developer Bookmark Manager",
        },
        servers: [
            {
                url: "http://localhost:8080",
                description: "Development server",
            },
        ],
    },
    apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.get("/", (req, res) => {
    res.send("ping");
});

app.use("/api/auth", authRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/notes", noteRoutes);

// 404 Error handler
app.use((req, res, next) => {
    const error = new Error("Route not found");
    error.statusCode = 404;
    next(error);
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(port, async () => {
    try {
        await connectDB();
        console.log(`Server is running on port ${port}`);
        logger.info(`Server is running on port ${port}`);
    } catch (error) {
        console.log("Failed to connect to the database:", error.message);
        logger.error("Failed to connect to the database:", error.message);
    }
});
