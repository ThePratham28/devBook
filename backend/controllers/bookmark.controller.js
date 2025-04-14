import { Op } from "sequelize";
import models from "../models/model.js";

const { Bookmark, Tag, Category, BookmarkTag } = models;

export const createBookmark = async (req, res) => {
    try {
        const { title, url, description, isPublic } = req.body;

        const userId = req.user.id;
        const bookmark = await Bookmark.create({
            title,
            url,
            description,
            isPublic,
            userId,
        });

        res.status(201).json({ success: true, data: bookmark });
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
        const { tag, category, search} = req.query;

        // Sorting parameters
        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder === "desc" ? "DESC" : "ASC";

        const where = { userId };
        const include = [];

        if (tag) {
            include.push({
                model: Tag,
                where: { name: tag },
                through: { attributes: [] }, // Exclude the join table attributes
            });
        }

        if (category) {
            include.push({
                model: Category,
                where: { name: category },
            });
        }

        if(search) {
            where[Op.or] = [
                {title: {[Op.iLike]: `%${search}%`}},
                {description: {[Op.iLike]: `%${search}%`}}
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
        const { title, url, description, isPublic } = req.body;

        const bookmark = await Bookmark.findOne({
            where: { id, userId },
        });

        if (!bookmark) {
            return res.status(404).json({
                success: false,
                message: "Bookmark not found",
            });
        }

        bookmark.title = title || bookmark.title;
        bookmark.url = url || bookmark.url;
        bookmark.description = description || bookmark.description;
        bookmark.isPublic =
            isPublic !== undefined ? isPublic : bookmark.isPublic;

        await bookmark.save();

        res.status(200).json({ success: true, data: bookmark });
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
