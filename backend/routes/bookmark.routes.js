import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
    createBookmark,
    getBookmarkById,
    getBookmarks,
} from "../controllers/bookmark.controller.js";

const router = Router();

router.post("/", authenticate, createBookmark);
router.get("/", authenticate, getBookmarks);
router.get("/:id", authenticate, getBookmarkById);
router.put("/:id", authenticate, createBookmark);
router.delete("/:id", authenticate, createBookmark);

export default router;
