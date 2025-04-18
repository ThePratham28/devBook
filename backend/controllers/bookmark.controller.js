import { Op } from "sequelize";
import models from "../models/model.js";
import { getCache, setCache, invalidateCache } from "../utils/redisCache.js";
import multer from "multer";
import s3 from "../utils/zataS3.js";

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
            const error = new Error("Category not found or unauthorized");
            error.statusCode = 404;
            throw error;
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

        const uniqueTagIds = [...new Set(tags.map((id) => Number(id)))];
        await bookmark.addTags(uniqueTagIds);

        // Invalidate cache for bookmarks list
        await invalidateCache(`bookmarks:${userId}`);

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
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to create bookmark",
        });
    }
};

export const getBookmarks = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            const error = new Error("Invalid user ID");
            error.statusCode = 400;
            throw error;
        }

        // // Cache key
        // const cacheKey = `bookmarks:${userId}`;
        // const cachedData = await getCache(cacheKey);

        // if (cachedData) {
        //     console.log("Cached data:", cachedData); // Log cached data
        //     return res.status(200).json(cachedData);
        // }

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
        const include = [
            {
                model: Category,
            },
            {
                model: Tag,
                through: { attributes: [] },
            },
        ];

        if (tag) {
            const tagInclude = include.find((inc) => inc.model === Tag);
            tagInclude.where = { name: tag };
        }

        if (category) {
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

        const response = {
            success: true,
            data: bookmarks,
            meta: {
                total,
                totalPages,
                currpage: page,
                perPage: limit,
            },
        };

        // await setCache(cacheKey, response);

        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching bookmarks:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to fetch bookmarks",
        });
    }
};

export const getBookmarkById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        if (!id || !userId) {
            const error = new Error("Invalid bookmark ID or user ID");
            error.statusCode = 400;
            throw error;
        }

        const cacheKey = `bookmark:${userId}:${id}`;
        const cachedData = await getCache(cacheKey);

        if (cachedData) {
            return res.status(200).json(cachedData);
        }

        const bookmark = await Bookmark.findOne({
            where: { id, userId },
        });

        if (!bookmark) {
            const error = new Error("Bookmark not found");
            error.statusCode = 404;
            throw error;
        }

        await setCache(cacheKey, { success: true, data: bookmark });

        res.status(200).json({ success: true, data: bookmark });
    } catch (error) {
        console.error("Error fetching bookmark:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to fetch bookmark",
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
            const error = new Error("Bookmark not found");
            error.statusCode = 404;
            throw error;
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
            await bookmark.setTags([]);
            if (tags.length > 0) {
                await bookmark.addTags(tags);
            }
        }

        // Invalidate cache for this bookmark and bookmarks list
        await invalidateCache(`bookmark:${userId}:${id}`);
        await invalidateCache(`bookmarks:${userId}`);

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
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to update bookmark",
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
            const error = new Error("Bookmark not found");
            error.statusCode = 404;
            throw error;
        }

        await bookmark.destroy();

        // Invalidate cache for this bookmark and bookmarks list
        await invalidateCache(`bookmark:${userId}:${id}`);
        await invalidateCache(`bookmarks:${userId}`);

        res.status(200).json({
            success: true,
            message: "Bookmark deleted",
            data: null,
        });
    } catch (error) {
        console.error(`Error deleting bookmark with ID ${id}:`, error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to delete bookmark",
        });
    }
};

const upload = multer();

export const uploadBookmarkAttchment = [
    upload.single("file"),
    async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            // Validate bookmark ownership
            const bookmark = await Bookmark.findOne({ where: { id, userId } });
            if (!bookmark) {
                return res.status(404).json({ error: "Bookmark not found" });
            }
            if (!req.file) {
                return res.status(400).json({ error: "File is missing" });
            }

            const params = {
                Bucket: process.env.ZATA_BUCKET_NAME,
                Key: `${userId}/bookmarks/${id}/${req.file.originalname}`,
                Body: req.file.buffer,
            };
            const uploadResult = await s3.upload(params).promise();

            // Update bookmark with file URL
            bookmark.fileUrl = uploadResult.Location;
            await bookmark.save();

            res.status(200).json({
                success: true,
                message: "File uploaded successfully",
                fileUrl: uploadResult.Location,
            });
        } catch (error) {
            console.error("Error uploading bookmark attachment:", error);
            res.status(error.statusCode || 500).json({
                success: false,
                message:
                    error.message || "Failed to upload bookmark attachment",
            });
        }
    },
];
