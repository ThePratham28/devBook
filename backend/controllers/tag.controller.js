import models from "../models/model.js";
import { getCache, setCache, invalidateCache } from "../utils/redisCache.js";

const { Tag } = models;

// Create a new tag
export const createTag = async (req, res, next) => {
    try {
        const { name } = req.body;

        const tag = await Tag.create({ name });

        // Invalidate cache for all tags
        await invalidateCache("tags");

        res.status(201).json({ success: true, data: tag });
    } catch (error) {
        console.error("Error creating tag:", error);
        const err = new Error("Failed to create tag");
        err.statusCode = 500;
        err.details = error.message;
        next(err);
    }
};

// Get all tags
export const getAllTags = async (req, res, next) => {
    try {
        // Check cache
        const cachedTags = await getCache("tags");
        if (cachedTags) {
            return res.status(200).json({ success: true, data: cachedTags });
        }

        // Fetch from database
        const tags = await Tag.findAll();

        // Cache the results
        await setCache("tags", tags);

        res.status(200).json({ success: true, data: tags });
    } catch (error) {
        console.error("Error fetching tags:", error);
        const err = new Error("Failed to fetch tags");
        err.statusCode = 500;
        err.details = error.message;
        next(err);
    }
};

// Delete a tag
export const deleteTag = async (req, res, next) => {
    try {
        const { id } = req.params;

        const tag = await Tag.findByPk(id);
        if (!tag) {
            const err = new Error("Tag not found");
            err.statusCode = 404;
            throw err;
        }

        await tag.destroy();

        // Invalidate cache for all tags
        await invalidateCache("tags");

        res.status(200).json({ success: true, message: "Tag deleted" });
    } catch (error) {
        console.error("Error deleting tag:", error);
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};
