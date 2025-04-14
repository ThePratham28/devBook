import { Router } from "express";
import {
    createTag,
    deleteTag,
    getAllTags,
} from "../controllers/tag.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authenticate, createTag);
router.get("/", authenticate, getAllTags);
router.delete("/:id", authenticate, deleteTag);

export default router;
