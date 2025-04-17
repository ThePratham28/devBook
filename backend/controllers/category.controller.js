import models from "../models/model.js";
import { getCache, setCache, invalidateCache } from "../utils/redisCache.js";

const { Category } = models;

// Create a new category
export const createCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        const userId = req.user.id;

        const category = await Category.create({ name, userId });

        // Invalidate cache for the user's categories
        await invalidateCache(`categories:${userId}`);

        res.status(201).json({ success: true, data: category });
    } catch (error) {
        console.error("Error creating category:", error);
        const err = new Error("Failed to create category");
        err.statusCode = 500;
        err.details = error.message;
        next(err);
    }
};

// Get all categories for the authenticated user
export const getAllCategories = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Check cache first
        const cacheKey = `categories:${userId}`;
        const cachedCategories = await getCache(cacheKey);

        if (cachedCategories) {
            return res.status(200).json({ success: true, data: cachedCategories });
        }

        // Fetch from database if not in cache
        const categories = await Category.findAll({ where: { userId } });

        // Cache the result
        await setCache(cacheKey, categories);

        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        console.error("Error fetching categories:", error);
        const err = new Error("Failed to fetch categories");
        err.statusCode = 500;
        err.details = error.message;
        next(err);
    }
};

// Delete a category
export const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const category = await Category.findOne({ where: { id, userId } });
        if (!category) {
            const err = new Error("Category not found");
            err.statusCode = 404;
            throw err;
        }

        await category.destroy();

        // Invalidate cache for the user's categories
        await invalidateCache(`categories:${userId}`);

        res.status(200).json({ success: true, message: "Category deleted" });
    } catch (error) {
        console.error("Error deleting category:", error);
        if (!error.statusCode) {
            const err = new Error("Failed to delete category");
            err.statusCode = 500;
            err.details = error.message;
            next(err);
        } else {
            next(error);
        }
    }
};