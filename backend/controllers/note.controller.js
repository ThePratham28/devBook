import models from "../models/model.js";
import { getCache, setCache, invalidateCache } from "../utils/redisCache.js";

const { Note } = models;

// Create a new note
export const createNote = async (req, res, next) => {
    try {
        const { content, bookmarkId } = req.body;

        const note = await Note.create({ content, bookmarkId });

        // Invalidate cache for the bookmark's notes
        await invalidateCache(`notes:bookmark:${bookmarkId}`);

        res.status(201).json({ success: true, data: note });
    } catch (error) {
        error.statusCode = 500;
        error.message = "Failed to create note";
        next(error);
    }
};

// Get all notes for a bookmark
export const getNotesByBookmark = async (req, res, next) => {
    try {
        const { bookmarkId } = req.params;

        // Check cache first
        const cacheKey = `notes:bookmark:${bookmarkId}`;
        const cachedNotes = await getCache(cacheKey);
        if (cachedNotes) {
            return res.status(200).json({ success: true, data: cachedNotes });
        }

        // Fetch from database if not in cache
        const notes = await Note.findAll({ where: { bookmarkId } });

        // Cache the result
        await setCache(cacheKey, notes);

        res.status(200).json({ success: true, data: notes });
    } catch (error) {
        error.statusCode = 500;
        error.message = "Failed to fetch notes";
        next(error);
    }
};

// Update a note
export const updateNote = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        const note = await Note.findByPk(id);
        if (!note) {
            const error = new Error("Note not found");
            error.statusCode = 404;
            throw error;
        }

        // Check if the note belongs to the authenticated user
        if (note.userId !== req.user.id) {
            const error = new Error("You do not have permission to update this note");
            error.statusCode = 403;
            throw error;
        }

        note.content = content || note.content;
        await note.save();

        // Invalidate cache for the bookmark's notes
        await invalidateCache(`notes:bookmark:${note.bookmarkId}`);

        res.status(200).json({ success: true, data: note });
    } catch (error) {
        if (!error.statusCode) error.statusCode = 500;
        error.message = error.message || "Failed to update note";
        next(error);
    }
};

// Delete a note
export const deleteNote = async (req, res, next) => {
    try {
        const { id } = req.params;

        const note = await Note.findByPk(id);
        if (!note) {
            const error = new Error("Note not found");
            error.statusCode = 404;
            throw error;
        }

        await note.destroy();

        // Invalidate cache for the bookmark's notes
        await invalidateCache(`notes:bookmark:${note.bookmarkId}`);

        res.status(200).json({ success: true, message: "Note deleted" });
    } catch (error) {
        if (!error.statusCode) error.statusCode = 500;
        error.message = error.message || "Failed to delete note";
        next(error);
    }
};
