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
        <div className="min-h-screen bg-gray-50">
            {/* Header & Navigation */}
            <header className="bg-indigo-700 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold">DevBook</h1>
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-2 bg-indigo-800 hover:bg-indigo-900 py-2 px-4 rounded-lg transition duration-150"
                            >
                                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                                    <FiUser className="text-white" />
                                </div>
                                <span>{currentUser?.name || "User"}</span>
                            </button>

                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10">
                                    <div className="py-2 border-b border-gray-100 px-4">
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
                                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                            <FiUser className="text-gray-500" />
                                            <span>Profile</span>
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
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
                <div className="flex justify-between items-center mb-8">
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
                        className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition duration-150 shadow-md"
                    >
                        <FiPlus />
                        <span>Add Bookmark</span>
                    </button>
                </div>

                {/* Filters and Search */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="lg:col-span-2">
                            <label
                                htmlFor="search"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Search
                            </label>
                            <input
                                id="search"
                                type="text"
                                placeholder="Search by title or description..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="category"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Category
                            </label>
                            <select
                                id="category"
                                value={categoryFilter}
                                onChange={(e) =>
                                    setCategoryFilter(e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.name}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label
                                htmlFor="tag"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Tag
                            </label>
                            <select
                                id="tag"
                                value={tagFilter}
                                onChange={(e) => setTagFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
                            <label
                                htmlFor="sort"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Sort By
                            </label>
                            <div className="flex space-x-1">
                                <select
                                    id="sort"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-2 py-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="createdAt">
                                        Date Created
                                    </option>
                                    <option value="title">Title</option>
                                </select>
                                <select
                                    value={sortOrder}
                                    onChange={(e) =>
                                        setSortOrder(e.target.value)
                                    }
                                    className="px-2 py-2 border border-gray-300 rounded-r-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="asc">↑</option>
                                    <option value="desc">↓</option>
                                </select>
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
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                            >
                                <div className="p-4 border-b border-gray-100">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex-1">
                                            {bookmark.title}
                                        </h3>
                                        <a
                                            href={bookmark.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-600 hover:text-indigo-800 ml-2"
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

                                <div className="px-4 py-3 bg-gray-50 flex justify-between">
                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/edit-bookmark/${bookmark.id}`
                                            )
                                        }
                                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        <FiEdit2 className="mr-1" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleDelete(bookmark.id)
                                        }
                                        className="inline-flex items-center text-sm text-red-600 hover:text-red-800"
                                    >
                                        <FiTrash2 className="mr-1" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <div className="flex flex-col items-center">
                            <div className="rounded-full bg-indigo-100 p-6 mb-4">
                                <FiPlus className="text-3xl text-indigo-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                No bookmarks found
                            </h3>
                            <p className="text-gray-500 mb-4">
                                Get started by adding your first developer
                                bookmark
                            </p>
                            <button
                                onClick={() => navigate("/create-bookmark")}
                                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition duration-150"
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
