import { Op } from "sequelize";
import models from "../models/model.js";

const { Bookmark, Tag, Category, BookmarkTag } = models;

export const createBookmark = async (req, res) => {
    try {
        const { title, url, description, isPublic, categoryId, tags } =
            req.body;

        const userId = req.user.id;

        // Validate category
        const category = await Category.findOne({
            where: { id: categoryId, userId },
        });
        if (!category) {
            return res
                .status(404)
                .json({ message: "Category not found or unauthorized" });
        }

        // Create bookmark
        const bookmark = await Bookmark.create({
            title,
            url,
            description,
            isPublic,
            userId,
            categoryId,
        });

        if (tags && tags.length > 0) {
            await bookmark.addTags(tags);
        }

        // Fetch bookmark with associated tags
        const createdBookmark = await Bookmark.findOne({
            where: { id: bookmark.id },
            include: [
                {
                    model: Tag,
                    through: { attributes: [] }, 
                },
                {
                    model: Category,
                },
            ],
        });

        res.status(201).json({ success: true, data: createdBookmark });
    } catch (error) {
        console.error("Error creating bookmark:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create bookmark",
            error: error.message,
        });
    }
};

export const getBookmarks = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Filter parameters
        const { tag, category, search } = req.query;

        // Sorting parameters
        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder === "desc" ? "DESC" : "ASC";

        const where = { userId };
        // Modified version for bookmark.controller.js
        const include = [
            {
                model: Category,
            },
            {
                model: Tag,
                through: { attributes: [] }, 
            },
        ];

        // Then modify your filter conditions to use 'where' within the existing includes
        if (tag) {
            // Find the Tag include and add the where clause
            const tagInclude = include.find((inc) => inc.model === Tag);
            tagInclude.where = { name: tag };
        }

        if (category) {
            // Find the Category include and add the where clause
            const categoryInclude = include.find(
                (inc) => inc.model === Category
            );
            categoryInclude.where = { name: category };
        }

        if (search) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } },
            ];
        }

        const { rows: bookmarks, count: total } =
            await Bookmark.findAndCountAll({
                where,
                include,
                limit,
                offset,
                order: [[sortBy, sortOrder]],
            });

        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            data: bookmarks,
            meta: {
                total,
                totalPages,
                currpage: page,
                perPage: limit,
            },
        });
    } catch (error) {
        console.error("Error fetching bookmarks:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch bookmarks",
            error: error.message,
        });
    }
};

export const getBookmarkById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        if (!id || !userId) {
            return res.status(400).json({
                success: false,
                message: "Invalid bookmark ID or user ID",
            });
        }

        const bookmark = await Bookmark.findOne({
            where: { id, userId },
        });

        if (!bookmark) {
            return res.status(404).json({
                success: false,
                message: "Bookmark not found",
            });
        }

        res.status(200).json({ success: true, data: bookmark });
    } catch (error) {
        console.error("Error fetching bookmark:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch bookmark",
            error: error.message,
        });
    }
};

export const updateBookmark = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { title, url, description, isPublic, categoryId, tags } =
            req.body;

        const bookmark = await Bookmark.findOne({
            where: { id, userId },
        });

        if (!bookmark) {
            return res.status(404).json({
                success: false,
                message: "Bookmark not found",
            });
        }

        // Update bookmark
        await bookmark.update({
            title,
            url,
            description,
            isPublic,
            categoryId,
        });

        if (tags) {
            // Remove all existing associations and add new ones
            await bookmark.setTags([]);
            if (tags.length > 0) {
                await bookmark.addTags(tags);
            }
        }

        // Fetch updated bookmark with associations
        const updatedBookmark = await Bookmark.findOne({
            where: { id },
            include: [
                {
                    model: Tag,
                    through: { attributes: [] }, 
                },
                {
                    model: Category,
                },
            ],
        });

        return res.status(200).json({
            success: true,
            data: updatedBookmark,
        });
    } catch (error) {
        console.error("Error updating bookmark:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update bookmark",
            error: error.message,
        });
    }
};

export const deleteBookmark = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const bookmark = await Bookmark.findOne({
            where: { id, userId },
        });

        if (!bookmark) {
            return res.status(404).json({
                success: false,
                message: "Bookmark not found",
            });
        }

        await bookmark.destroy();

        res.status(200).json({
            success: true,
            message: "Bookmark deleted",
            data: null,
        });
    } catch (error) {
        console.error(`Error deleting bookmark with ID ${id}:`, error);
        res.status(500).json({
            success: false,
            message: "Failed to delete bookmark",
            error: error.message,
        });
    }
};
