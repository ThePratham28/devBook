import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connectDb.js";

import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import "./config/passport.config.js";
import logger from "./utils/logger.js";

import authRoutes from "./routes/authRoutes.js";
import bookmarkRoutes from "./routes/bookmark.routes.js";
import tagRoutes from "./routes/tag.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import noteRoutes from "./routes/note.routes.js";

dotenv.config();
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

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

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

app.get("/", (req, res) => {
    res.send("ping");
});

app.use("/api/auth", authRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/notes", noteRoutes);
