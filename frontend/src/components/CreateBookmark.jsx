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
    FiExternalLink,
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
    const [previewImage, setPreviewImage] = useState(null);
    const [loadingPreview, setLoadingPreview] = useState(false);

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
                previewImage,
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

    // Auto-extract title and metadata from URL
    const extractTitleFromUrl = async () => {
        if (!url) {
            toast.error("Please enter a URL first");
            return;
        }

        try {
            setLoadingPreview(true);
            // In a real application, you would make a request to your backend
            // to fetch metadata from the URL. Here we're simulating it:

            // Mock implementation - in a real app this would call your backend
            setTimeout(() => {
                // Simulate successfully fetching title and description
                setTitle(
                    url.includes("github")
                        ? "GitHub Repository"
                        : url.includes("stackoverflow")
                        ? "Stack Overflow Question"
                        : "Website Title"
                );

                setDescription(
                    "This is an automatically extracted description from the web page's metadata."
                );

                // Set a sample preview image based on the URL
                if (url.includes("github")) {
                    setPreviewImage(
                        "https://github.githubassets.com/images/modules/site/social-cards/github-social.png"
                    );
                } else if (url.includes("stackoverflow")) {
                    setPreviewImage(
                        "https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon.png"
                    );
                } else {
                    setPreviewImage(
                        "https://via.placeholder.com/600x300/e2e8f0/475569?text=Website+Preview"
                    );
                }

                setLoadingPreview(false);
                toast.success("Title, description and preview image extracted");
            }, 1500);
        } catch (error) {
            console.error("Error extracting metadata:", error);
            toast.error("Failed to extract metadata from URL");
            setLoadingPreview(false);
        }
    };

    // Display selected tags
    const selectedTagNames = availableTags
        .filter((tag) => tags.includes(tag.id.toString()))
        .map((tag) => tag.name);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
            {/* Header */}
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-2">
                            <div className="p-1.5 bg-indigo-600 rounded text-white">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                DevBook
                            </h1>
                        </div>
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

                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
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
                                        disabled={loadingPreview}
                                        className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        {loadingPreview ? (
                                            <>
                                                <svg
                                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Extracting...
                                            </>
                                        ) : (
                                            "Extract Metadata"
                                        )}
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
                                {/* Enhanced Category Selection */}
                                <div>
                                    <label
                                        htmlFor="category"
                                        className="flex items-center text-sm font-medium text-gray-700"
                                    >
                                        <BiCategoryAlt className="mr-2 text-indigo-500" />
                                        Category
                                    </label>
                                    <div className="mt-1">
                                        <div className="relative">
                                            <select
                                                id="category"
                                                value={categoryId}
                                                onChange={(e) =>
                                                    setCategoryId(
                                                        e.target.value
                                                    )
                                                }
                                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
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
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M19 9l-7 7-7-7"
                                                    />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Selected category display */}
                                        {categoryId &&
                                            availableCategories.find(
                                                (c) =>
                                                    c.id.toString() ===
                                                    categoryId.toString()
                                            ) && (
                                                <div className="mt-2">
                                                    <div className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-800 border border-blue-100">
                                                        <BiCategoryAlt className="mr-2" />
                                                        {
                                                            availableCategories.find(
                                                                (c) =>
                                                                    c.id.toString() ===
                                                                    categoryId.toString()
                                                            ).name
                                                        }
                                                    </div>
                                                </div>
                                            )}

                                        <div className="mt-3">
                                            <div className="text-xs font-medium text-gray-500 mb-1">
                                                Add new category
                                            </div>
                                            <div className="flex">
                                                <input
                                                    type="text"
                                                    placeholder="E.g., Frontend, Design, Tools..."
                                                    value={newCategory}
                                                    onChange={(e) =>
                                                        setNewCategory(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-l-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleAddCategory}
                                                    className="inline-flex items-center px-3 py-2.5 border border-transparent text-sm font-medium rounded-r-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                                >
                                                    <FiPlus className="mr-1" />
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Enhanced Tags Selection */}
                                <div>
                                    <label
                                        htmlFor="tags-container"
                                        className="flex items-center text-sm font-medium text-gray-700"
                                    >
                                        <AiOutlineTags className="mr-2 text-indigo-500" />
                                        Tags
                                    </label>
                                    <div className="mt-1" id="tags-container">
                                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                                            <div className="p-3 max-h-[160px] overflow-y-auto bg-gray-50">
                                                {availableTags.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {availableTags.map(
                                                            (tag) => (
                                                                <div
                                                                    key={tag.id}
                                                                    className="flex items-center"
                                                                >
                                                                    <input
                                                                        id={`tag-${tag.id}`}
                                                                        type="checkbox"
                                                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                                        checked={tags.includes(
                                                                            tag.id.toString()
                                                                        )}
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            if (
                                                                                e
                                                                                    .target
                                                                                    .checked
                                                                            ) {
                                                                                setTags(
                                                                                    [
                                                                                        ...tags,
                                                                                        tag.id.toString(),
                                                                                    ]
                                                                                );
                                                                            } else {
                                                                                setTags(
                                                                                    tags.filter(
                                                                                        (
                                                                                            id
                                                                                        ) =>
                                                                                            id !==
                                                                                            tag.id.toString()
                                                                                    )
                                                                                );
                                                                            }
                                                                        }}
                                                                    />
                                                                    <label
                                                                        htmlFor={`tag-${tag.id}`}
                                                                        className="ml-2 block text-sm text-gray-900"
                                                                    >
                                                                        {
                                                                            tag.name
                                                                        }
                                                                    </label>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-500 text-center py-2">
                                                        No tags available
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <div className="text-xs font-medium text-gray-500 mb-1">
                                                Add new tag
                                            </div>
                                            <div className="flex">
                                                <input
                                                    type="text"
                                                    placeholder="E.g., react, tutorial, css..."
                                                    value={newTag}
                                                    onChange={(e) =>
                                                        setNewTag(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-l-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleAddTag}
                                                    className="inline-flex items-center px-3 py-2.5 border border-transparent text-sm font-medium rounded-r-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                                >
                                                    <FiPlus className="mr-1" />
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Selected Tags Display */}
                            {selectedTagNames.length > 0 && (
                                <div className="mt-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                        Selected tags ({selectedTagNames.length}
                                        ):
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedTagNames.map(
                                            (tagName, index) => (
                                                <div
                                                    key={index}
                                                    className="group inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200 hover:bg-indigo-200 transition-colors"
                                                >
                                                    <AiOutlineTags className="mr-1" />
                                                    {tagName}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const tagId =
                                                                availableTags
                                                                    .find(
                                                                        (t) =>
                                                                            t.name ===
                                                                            tagName
                                                                    )
                                                                    ?.id.toString();
                                                            if (tagId) {
                                                                setTags(
                                                                    tags.filter(
                                                                        (id) =>
                                                                            id !==
                                                                            tagId
                                                                    )
                                                                );
                                                            }
                                                        }}
                                                        className="ml-1.5 text-indigo-600 hover:text-indigo-800 focus:outline-none"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-3.5 w-3.5"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
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

                {/* Enhanced Preview Section */}
                {title && url && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Preview
                        </h2>

                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            {/* Preview Image Area */}
                            <div className="relative h-48 bg-gray-100 overflow-hidden">
                                {previewImage ? (
                                    <img
                                        src={previewImage}
                                        alt={title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full bg-gradient-to-r from-gray-100 to-gray-200">
                                        <div className="bg-white p-3 rounded-full">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-8 w-8 text-gray-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                )}

                                {/* Site favicon/domain */}
                                {url && (
                                    <div className="absolute top-3 left-3 bg-white bg-opacity-90 rounded-lg py-1 px-2 flex items-center shadow-sm">
                                        <img
                                            src={`https://www.google.com/s2/favicons?domain=${
                                                new URL(url).hostname
                                            }&sz=32`}
                                            alt="favicon"
                                            className="w-4 h-4 mr-1"
                                        />
                                        <span className="text-xs text-gray-700">
                                            {new URL(url).hostname.replace(
                                                "www.",
                                                ""
                                            )}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2 flex-1">
                                        {title}
                                    </h3>
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:text-indigo-800 ml-2 p-1 hover:bg-indigo-50 rounded-full transition"
                                    >
                                        <FiExternalLink />
                                    </a>
                                </div>

                                <p className="text-sm text-gray-600 mb-4">
                                    {description || "No description provided"}
                                </p>

                                <div className="flex flex-wrap gap-2">
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
                    </div>
                )}
            </main>
        </div>
    );
};

export default CreateBookmark;
