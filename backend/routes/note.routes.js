import { Router } from "express";
import {
    createNote,
    deleteNote,
    getNotesByBookmark,
    updateNote,
} from "../controllers/note.controller.js";
import { authenticate } from "passport";
const router = Router();

router.post("/", authenticate, createNote);
router.get("/:bookmarkId", authenticate, getNotesByBookmark);
router.delete("/:id", authenticate, deleteNote);
router.put("/:id", authenticate, updateNote);

export default router;