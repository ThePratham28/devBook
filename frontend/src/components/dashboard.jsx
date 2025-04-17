import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import {
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiExternalLink,
    FiLogOut,
    FiUser,
    FiChevronDown,
    FiSearch,
    FiBookmark,
} from "react-icons/fi";
import { BiCategoryAlt } from "react-icons/bi";
import { AiOutlineTags } from "react-icons/ai";

const API_URL = "http://localhost:8080/api";

const Dashboard = () => {
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();
    const [bookmarks, setBookmarks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [tagFilter, setTagFilter] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("asc");
    const [loading, setLoading] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Fetch bookmarks, categories, and tags
    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const [bookmarksRes, categoriesRes, tagsRes] = await Promise.all([
                axios.get(`${API_URL}/bookmarks`, {
                    params: {
                        search,
                        category: categoryFilter,
                        tag: tagFilter,
                        sortBy,
                        sortOrder,
                    },
                    ...config,
                }),
                axios.get(`${API_URL}/categories`, config),
                axios.get(`${API_URL}/tags`, config),
            ]);

            setBookmarks(bookmarksRes.data.data);
            setCategories(categoriesRes.data.data);
            setTags(tagsRes.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [search, categoryFilter, tagFilter, sortBy, sortOrder]);

    // Handle delete bookmark
    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            await axios.delete(`${API_URL}/bookmarks/${id}`, config);
            toast.success("Bookmark deleted successfully");
            fetchData();
        } catch (error) {
            console.error("Error deleting bookmark:", error);
            toast.error("Failed to delete bookmark");
        }
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Error logging out:", error);
            toast.error("Failed to log out");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
            {/* Header & Navigation */}
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
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-lg transition duration-150"
                            >
                                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                                    <FiUser className="text-white" />
                                </div>
                                <span className="text-gray-800 font-medium">
                                    {currentUser?.name || "User"}
                                </span>
                                <FiChevronDown className="text-gray-500" />
                            </button>

                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-10 border border-gray-100 overflow-hidden">
                                    <div className="py-3 border-b border-gray-100 px-4">
                                        <p className="text-sm font-medium text-gray-800">
                                            {currentUser?.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {currentUser?.email}
                                        </p>
                                    </div>
                                    <div className="py-1">
                                        <button
                                            onClick={() => navigate("/profile")}
                                            className="flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition"
                                        >
                                            <FiUser className="text-gray-500" />
                                            <span>Profile</span>
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center space-x-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left transition"
                                        >
                                            <FiLogOut className="text-red-500" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Dashboard Title and Actions */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 space-y-4 md:space-y-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            My Bookmarks
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Organize and manage your development resources
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/create-bookmark")}
                        className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg transition duration-150 shadow-md self-start md:self-auto"
                    >
                        <FiPlus />
                        <span>Add Bookmark</span>
                    </button>
                </div>

                {/* Category Tabs */}
                <div className="mb-6 overflow-x-auto">
                    <div className="inline-flex rounded-lg bg-gray-100 p-1 min-w-full">
                        <button
                            onClick={() => setCategoryFilter("")}
                            className={`px-4 py-2 text-sm font-medium rounded-md ${
                                categoryFilter === ""
                                    ? "bg-white text-indigo-700 shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                            } transition`}
                        >
                            All
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setCategoryFilter(category.name)}
                                className={`px-4 py-2 text-sm font-medium rounded-md ${
                                    categoryFilter === category.name
                                        ? "bg-white text-indigo-700 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                } transition`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiSearch className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="search"
                                    type="text"
                                    placeholder="Search by title or description..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <select
                                    id="tag"
                                    value={tagFilter}
                                    onChange={(e) =>
                                        setTagFilter(e.target.value)
                                    }
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                >
                                    <option value="">All Tags</option>
                                    {tags.map((tag) => (
                                        <option key={tag.id} value={tag.name}>
                                            {tag.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <div className="flex space-x-1">
                                    <select
                                        id="sort"
                                        value={sortBy}
                                        onChange={(e) =>
                                            setSortBy(e.target.value)
                                        }
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-l-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                    >
                                        <option value="createdAt">Date</option>
                                        <option value="title">Title</option>
                                    </select>
                                    <button
                                        onClick={() =>
                                            setSortOrder(
                                                sortOrder === "asc"
                                                    ? "desc"
                                                    : "asc"
                                            )
                                        }
                                        className="px-3 py-2.5 border border-gray-300 rounded-r-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 bg-white"
                                    >
                                        {sortOrder === "asc" ? "↑" : "↓"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bookmarks List */}
                {loading ? (
                    <div className="flex justify-center items-center p-12">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                    </div>
                ) : bookmarks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bookmarks.map((bookmark) => (
                            <div
                                key={bookmark.id}
                                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col"
                            >
                                {/* Link Preview Image */}
                                <div className="relative h-40 bg-gray-100 overflow-hidden">
                                    {bookmark.previewImage ? (
                                        <img
                                            src={bookmark.previewImage}
                                            alt={bookmark.title}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
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
                                    <div className="absolute top-3 left-3 bg-white bg-opacity-90 rounded-lg py-1 px-2 flex items-center shadow-sm">
                                        <img
                                            src={`https://www.google.com/s2/favicons?domain=${
                                                new URL(bookmark.url).hostname
                                            }&sz=32`}
                                            alt="favicon"
                                            className="w-4 h-4 mr-1"
                                        />
                                        <span className="text-xs text-gray-700">
                                            {new URL(
                                                bookmark.url
                                            ).hostname.replace("www.", "")}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 flex-grow">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex-1">
                                            {bookmark.title}
                                        </h3>
                                        <a
                                            href={bookmark.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-600 hover:text-indigo-800 ml-2 p-1 hover:bg-indigo-50 rounded-full transition"
                                        >
                                            <FiExternalLink />
                                        </a>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {bookmark.description ||
                                            "No description provided"}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {bookmark.Category && (
                                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                <BiCategoryAlt className="mr-1" />
                                                {bookmark.Category.name}
                                            </div>
                                        )}

                                        {bookmark.Tags &&
                                            bookmark.Tags.map((tag) => (
                                                <div
                                                    key={tag.id}
                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                                >
                                                    <AiOutlineTags className="mr-1" />
                                                    {tag.name}
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <div className="px-4 py-3 bg-gray-50 flex justify-between border-t border-gray-100">
                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/edit-bookmark/${bookmark.id}`
                                            )
                                        }
                                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition"
                                    >
                                        <FiEdit2 className="mr-1" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDelete(bookmark.id)
                                        }
                                        className="inline-flex items-center text-sm text-red-600 hover:text-red-800 transition"
                                    >
                                        <FiTrash2 className="mr-1" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <div className="flex flex-col items-center">
                            <div className="rounded-full bg-indigo-100 p-6 mb-4">
                                <FiBookmark className="text-3xl text-indigo-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                No bookmarks found
                            </h3>
                            <p className="text-gray-500 mb-6 max-w-md">
                                {categoryFilter || tagFilter || search
                                    ? "No bookmarks match your current filters. Try adjusting your search criteria."
                                    : "Get started by adding your first developer bookmark"}
                            </p>
                            <button
                                onClick={() => navigate("/create-bookmark")}
                                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition duration-150"
                            >
                                <FiPlus />
                                <span>Add Bookmark</span>
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
