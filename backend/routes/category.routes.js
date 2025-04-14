import { Router } from "express";
import {
    createCategory,
    deleteCategory,
    getAllCategories,
} from "../controllers/category.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authenticate, createCategory);
router.get("/", authenticate, getAllCategories);
router.delete("/:id", authenticate, deleteCategory);

export default router;
