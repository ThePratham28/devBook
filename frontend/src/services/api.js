import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api"; // Update with your backend URL

// Axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // For cookies (if needed)
});

// Authentication APIs
export const login = (email, password) =>
    api.post("/auth/login", { email, password });
export const signup = (data) => api.post("/auth/signup", data);
export const logout = () => api.post("/auth/logout");

// Bookmark APIs
export const getBookmarks = (params) => api.get("/bookmarks", { params });
export const createBookmark = (data) => api.post("/bookmarks", data);
export const updateBookmark = (id, data) => api.put(`/bookmarks/${id}`, data);
export const deleteBookmark = (id) => api.delete(`/bookmarks/${id}`);

// Tag APIs
export const getTags = () => api.get("/tags");
export const createTag = (data) => api.post("/tags", data);

// Category APIs
export const getCategories = () => api.get("/categories");
export const createCategory = (data) => api.post("/categories", data);

export default api;
