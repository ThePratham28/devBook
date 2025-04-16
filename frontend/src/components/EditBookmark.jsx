import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8080/api";

const EditBookmark = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the bookmark ID from the URL
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [description, setDescription] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const [categoryId, setCategoryId] = useState("");
    const [tags, setTags] = useState([]);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [newTag, setNewTag] = useState("");

    // Fetch bookmark details, categories, and tags
    const fetchBookmarkDetails = async () => {
        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const [bookmarkRes, categoriesRes, tagsRes] = await Promise.all([
                axios.get(`${API_URL}/bookmarks/${id}`, config),
                axios.get(`${API_URL}/categories`, config),
                axios.get(`${API_URL}/tags`, config),
            ]);

            const bookmark = bookmarkRes.data.data;
            setTitle(bookmark.title);
            setUrl(bookmark.url);
            setDescription(bookmark.description);
            setIsPublic(bookmark.isPublic);
            setCategoryId(bookmark.categoryId || "");
            setTags(bookmark.Tags?.map((tag) => tag.id) || []);
            setAvailableCategories(categoriesRes.data.data);
            setAvailableTags(tagsRes.data.data);
        } catch (error) {
            console.error("Error fetching bookmark details:", error);
            toast.error("Failed to load bookmark details");
        }
    };

    useEffect(() => {
        fetchBookmarkDetails();
    }, [id]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const payload = {
                title,
                url,
                description,
                isPublic,
                categoryId,
                tags,
            };

            await axios.put(`${API_URL}/bookmarks/${id}`, payload, config);
            toast.success("Bookmark updated successfully");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error updating bookmark:", error);
            toast.error("Failed to update bookmark");
        }
    };

    // Handle adding a new category
    const handleAddCategory = async () => {
        if (!newCategory.trim()) {
            toast.error("Category name cannot be empty");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.post(
                `${API_URL}/categories`,
                { name: newCategory },
                config
            );

            setAvailableCategories([
                ...availableCategories,
                response.data.data,
            ]);
            setCategoryId(response.data.data.id); // Automatically select the new category
            setNewCategory("");
            toast.success("Category added successfully");
        } catch (error) {
            console.error("Error adding category:", error);
            toast.error("Failed to add category");
        }
    };

    // Handle adding a new tag
    const handleAddTag = async () => {
        if (!newTag.trim()) {
            toast.error("Tag name cannot be empty");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.post(
                `${API_URL}/tags`,
                { name: newTag },
                config
            );

            setAvailableTags([...availableTags, response.data.data]);
            setTags([...tags, response.data.data.id]); // Automatically select the new tag
            setNewTag("");
            toast.success("Tag added successfully");
        } catch (error) {
            console.error("Error adding tag:", error);
            toast.error("Failed to add tag");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Edit Bookmark
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="url"
                            className="block text-sm font-medium text-gray-700"
                        >
                            URL
                        </label>
                        <input
                            type="url"
                            id="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        ></textarea>
                    </div>
                    <div>
                        <label
                            htmlFor="category"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Category
                        </label>
                        <div className="flex gap-2">
                            <select
                                id="category"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Select a category</option>
                                {availableCategories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="New category"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="mt-1 block px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <button
                                type="button"
                                onClick={handleAddCategory}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="tags"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Tags
                        </label>
                        <div className="flex gap-2">
                            <select
                                id="tags"
                                multiple
                                value={tags}
                                onChange={(e) =>
                                    setTags(
                                        Array.from(
                                            e.target.selectedOptions,
                                            (option) => option.value
                                        )
                                    )
                                }
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {availableTags.map((tag) => (
                                    <option key={tag.id} value={tag.id}>
                                        {tag.name}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="New tag"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                className="mt-1 block px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <button
                                type="button"
                                onClick={handleAddTag}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isPublic"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label
                            htmlFor="isPublic"
                            className="ml-2 block text-sm text-gray-900"
                        >
                            Make this bookmark public
                        </label>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            Update
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="ml-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBookmark;
