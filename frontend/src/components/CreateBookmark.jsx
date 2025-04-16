import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
    FiArrowLeft,
    FiLink,
    FiSave,
    FiPlus,
    FiEye,
    FiEyeOff,
} from "react-icons/fi";
import { BiCategoryAlt } from "react-icons/bi";
import { AiOutlineTags } from "react-icons/ai";

const API_URL = "http://localhost:8080/api";

const CreateBookmark = () => {
    const navigate = useNavigate();
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
    const [loading, setLoading] = useState(false);

    // Fetch categories and tags
    const fetchMetadata = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const [categoriesRes, tagsRes] = await Promise.all([
                axios.get(`${API_URL}/categories`, config),
                axios.get(`${API_URL}/tags`, config),
            ]);

            setAvailableCategories(categoriesRes.data.data);
            setAvailableTags(tagsRes.data.data);
        } catch (error) {
            console.error("Error fetching metadata:", error);
            toast.error("Failed to load categories and tags");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMetadata();
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
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

            await axios.post(`${API_URL}/bookmarks`, payload, config);
            toast.success("Bookmark created successfully");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error creating bookmark:", error);
            toast.error("Failed to create bookmark");
        } finally {
            setLoading(false);
        }
    };

    // Handle adding a new category
    const handleAddCategory = async () => {
        if (!newCategory.trim()) {
            toast.error("Category name cannot be empty");
            return;
        }

        try {
            setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    // Handle adding a new tag
    const handleAddTag = async () => {
        if (!newTag.trim()) {
            toast.error("Tag name cannot be empty");
            return;
        }

        try {
            setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    // Auto-extract title from URL
    const extractTitleFromUrl = async () => {
        if (!url) {
            toast.error("Please enter a URL first");
            return;
        }

        try {
            setLoading(true);
            // Here you could add logic to extract title from URL metadata
            // This would typically be a server-side function that fetches the URL and extracts the page title
            // For now, let's just assume we set a placeholder
            setTitle("Title extracted from URL");
            toast.info("Title extracted from URL (demonstration)");
        } catch (error) {
            console.error("Error extracting title:", error);
            toast.error("Failed to extract title from URL");
        } finally {
            setLoading(false);
        }
    };

    // Display selected tags
    const selectedTagNames = availableTags
        .filter((tag) => tags.includes(tag.id.toString()))
        .map((tag) => tag.name);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-indigo-700 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-2xl font-bold">DevBook</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition duration-150"
                >
                    <FiArrowLeft className="mr-2" />
                    Back to Dashboard
                </button>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">
                        Add New Bookmark
                    </h1>

                    {loading && (
                        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="url"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    URL <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <div className="relative flex items-stretch flex-grow">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiLink className="text-gray-400" />
                                        </div>
                                        <input
                                            type="url"
                                            id="url"
                                            value={url}
                                            onChange={(e) =>
                                                setUrl(e.target.value)
                                            }
                                            required
                                            placeholder="https://example.com"
                                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md py-3"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={extractTitleFromUrl}
                                        className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Extract Title
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Title{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    placeholder="Enter a descriptive title"
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    rows="4"
                                    placeholder="What's this bookmark about?"
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        htmlFor="category"
                                        className="flex items-center text-sm font-medium text-gray-700"
                                    >
                                        <BiCategoryAlt className="mr-2 text-indigo-500" />
                                        Category
                                    </label>
                                    <div className="mt-1">
                                        <select
                                            id="category"
                                            value={categoryId}
                                            onChange={(e) =>
                                                setCategoryId(e.target.value)
                                            }
                                            className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="">
                                                Select a category
                                            </option>
                                            {availableCategories.map(
                                                (category) => (
                                                    <option
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.name}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                    <div className="mt-2 flex">
                                        <input
                                            type="text"
                                            placeholder="New category"
                                            value={newCategory}
                                            onChange={(e) =>
                                                setNewCategory(e.target.value)
                                            }
                                            className="block w-full px-4 py-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddCategory}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            <FiPlus className="mr-2" />
                                            Add
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="tags"
                                        className="flex items-center text-sm font-medium text-gray-700"
                                    >
                                        <AiOutlineTags className="mr-2 text-indigo-500" />
                                        Tags
                                    </label>
                                    <div className="mt-1">
                                        <select
                                            id="tags"
                                            multiple
                                            value={tags}
                                            onChange={(e) =>
                                                setTags(
                                                    Array.from(
                                                        e.target
                                                            .selectedOptions,
                                                        (option) => option.value
                                                    )
                                                )
                                            }
                                            className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            size="3"
                                        >
                                            {availableTags.map((tag) => (
                                                <option
                                                    key={tag.id}
                                                    value={tag.id}
                                                >
                                                    {tag.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mt-2 flex">
                                        <input
                                            type="text"
                                            placeholder="New tag"
                                            value={newTag}
                                            onChange={(e) =>
                                                setNewTag(e.target.value)
                                            }
                                            className="block w-full px-4 py-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddTag}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            <FiPlus className="mr-2" />
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Selected Tags Display */}
                            {selectedTagNames.length > 0 && (
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500 mb-2">
                                        Selected tags:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedTagNames.map(
                                            (tagName, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                                >
                                                    <AiOutlineTags className="mr-1" />
                                                    {tagName}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center py-3 px-3 bg-gray-50 rounded-lg">
                                <input
                                    type="checkbox"
                                    id="isPublic"
                                    checked={isPublic}
                                    onChange={(e) =>
                                        setIsPublic(e.target.checked)
                                    }
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="isPublic"
                                    className="ml-2 flex items-center text-sm text-gray-900"
                                >
                                    {isPublic ? (
                                        <>
                                            <FiEye className="mr-1 text-indigo-500" />
                                            Make this bookmark public
                                        </>
                                    ) : (
                                        <>
                                            <FiEyeOff className="mr-1 text-gray-500" />
                                            Make this bookmark public
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => navigate("/dashboard")}
                                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <FiSave className="mr-2" />
                                Save Bookmark
                            </button>
                        </div>
                    </form>
                </div>

                {/* Preview Section */}
                {title && url && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Preview
                        </h2>
                        <div className="border border-gray-200 rounded-lg p-4">
                            <h3 className="text-lg font-medium text-gray-800">
                                {title}
                            </h3>
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-indigo-600 hover:text-indigo-800 mt-1 block"
                            >
                                {url}
                            </a>

                            {description && (
                                <p className="text-sm text-gray-600 mt-2">
                                    {description}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-2 mt-3">
                                {categoryId &&
                                    availableCategories.find(
                                        (c) =>
                                            c.id.toString() ===
                                            categoryId.toString()
                                    ) && (
                                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            <BiCategoryAlt className="mr-1" />
                                            {
                                                availableCategories.find(
                                                    (c) =>
                                                        c.id.toString() ===
                                                        categoryId.toString()
                                                ).name
                                            }
                                        </div>
                                    )}

                                {selectedTagNames.map((tagName, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                    >
                                        <AiOutlineTags className="mr-1" />
                                        {tagName}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CreateBookmark;
