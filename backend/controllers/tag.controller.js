import models from "../models/model.js";

const { Tag } = models;

// Create a new tag
export const createTag = async (req, res) => {
    try {
        const { name } = req.body;

        const tag = await Tag.create({ name });
        res.status(201).json({ success: true, data: tag });
    } catch (error) {
        console.error("Error creating tag:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create tag",
            error: error.message,
        });
    }
};

// Get all tags
export const getAllTags = async (req, res) => {
    try {
        const tags = await Tag.findAll();
        res.status(200).json({ success: true, data: tags });
    } catch (error) {
        console.error("Error fetching tags:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch tags",
            error: error.message,
        });
    }
};

// Delete a tag
export const deleteTag = async (req, res) => {
    try {
        const { id } = req.params;

        const tag = await Tag.findByPk(id);
        if (!tag) {
            return res.status(404).json({
                success: false,
                message: "Tag not found",
            });
        }

        await tag.destroy();
        res.status(200).json({ success: true, message: "Tag deleted" });
    } catch (error) {
        console.error("Error deleting tag:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete tag",
            error: error.message,
        });
    }
};