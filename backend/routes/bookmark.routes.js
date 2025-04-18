import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
    createBookmark,
    deleteBookmark,
    getBookmarkById,
    getBookmarks,
    updateBookmark,
    uploadBookmarkAttchment,
} from "../controllers/bookmark.controller.js";

const router = Router();

router.post("/", authenticate, createBookmark);
router.get("/", authenticate, getBookmarks);
router.get("/:id", authenticate, getBookmarkById);
router.put("/:id", authenticate, updateBookmark);
router.delete("/:id", authenticate, deleteBookmark);
router.post("/:id/upload", authenticate, uploadBookmarkAttchment);

export default router;
