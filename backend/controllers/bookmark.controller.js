import models from "../models/model.js";

const { Bookmark } = models;

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
        const bookmarks = await Bookmark.findAll({
            where: { userId },
            order: [["createdAt", "DESC"]],
        });

        res.status(200).json({ success: true, data: bookmarks });
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

        res.status(200).json({ success: true, message: "Bookmark deleted" });
    } catch (error) {
        console.error("Error deleting bookmark:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete bookmark",
            error: error.message,
        });
    }
};
