import models from "../models/model.js";

const { Note } = models;

// Create a new note
export const createNote = async (req, res) => {
    try {
        const { content, bookmarkId } = req.body;

        const note = await Note.create({ content, bookmarkId });
        res.status(201).json({ success: true, data: note });
    } catch (error) {
        console.error("Error creating note:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create note",
            error: error.message,
        });
    }
};

// Get all notes for a bookmark
export const getNotesByBookmark = async (req, res) => {
    try {
        const { bookmarkId } = req.params;

        const notes = await Note.findAll({ where: { bookmarkId } });
        res.status(200).json({ success: true, data: notes });
    } catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch notes",
            error: error.message,
        });
    }
};

// Update a note
export const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        const note = await Note.findByPk(id);
        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found",
            });
        }

        // Check if the note belongs to the authenticated user
        if (note.userId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to update this note",
            });
        }

        note.content = content || note.content;
        await note.save();

        res.status(200).json({ success: true, data: note });
    } catch (error) {
        console.error("Error updating note:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update note",
            error: error.message,
        });
    }
};

// Delete a note
export const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;

        const note = await Note.findByPk(id);
        if (!note) {
            return res.status(404).json({
                success: false,
                message: "Note not found",
            });
        }

        await note.destroy();
        res.status(200).json({ success: true, message: "Note deleted" });
    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete note",
            error: error.message,
        });
    }
};
