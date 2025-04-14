import models from "../models/model.js";

const { Category } = models;

// Create a new category
export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user.id;

        const category = await Category.create({ name, userId });
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create category",
            error: error.message,
        });
    }
};

// Get all categories for the authenticated user
export const getAllCategories = async (req, res) => {
    try {
        const userId = req.user.id;

        const categories = await Category.findAll({ where: { userId } });
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
            error: error.message,
        });
    }
};

// Delete a category
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const category = await Category.findOne({ where: { id, userId } });
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        await category.destroy();
        res.status(200).json({ success: true, message: "Category deleted" });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete category",
            error: error.message,
        });
    }
};