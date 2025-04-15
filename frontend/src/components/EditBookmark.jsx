import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditBookmark = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Sample data for existing tags and categories
  const existingTags = ['JavaScript', 'React', 'Node.js', 'CSS', 'HTML', 'API', 'Database', 'Git', 'Frontend', 'Backend'];
  const existingCategories = ['Documentation', 'Tutorials', 'Tools', 'Libraries', 'Frameworks', 'Articles', 'References'];

  // State for the form
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    description: ''
  });
  
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Fetch bookmark data (simulated)
  useEffect(() => {
    // In a real app, this would be an API call to get the bookmark by ID
    // For demo purposes, we'll use mock data
    setIsLoading(true);
    
    setTimeout(() => {
      // Mock data for the bookmark being edited
      const bookmarkData = {
        id: id,
        url: 'https://reactjs.org/docs',
        title: 'React Documentation',
        description: 'Official documentation for React - a JavaScript library for building user interfaces',
        tags: ['React', 'JavaScript', 'Frontend'],
        category: 'Documentation'
      };
      
      setFormData({
        url: bookmarkData.url,
        title: bookmarkData.title,
        description: bookmarkData.description || ''
      });
      
      setSelectedTags(bookmarkData.tags || []);
      setCategory(bookmarkData.category || '');
      
      setIsLoading(false);
    }, 800);
  }, [id]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle tag selection
  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  // Add new tag
  const handleAddNewTag = () => {
    if (newTag && !existingTags.includes(newTag) && !selectedTags.includes(newTag)) {
      setSelectedTags(prev => [...prev, newTag]);
      setNewTag('');
    }
  };

  // Handle category selection
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === 'add_new') {
      setIsAddingNewCategory(true);
      setCategory('');
    } else {
      setIsAddingNewCategory(false);
      setCategory(value);
    }
  };

  // Add new category
  const handleAddNewCategory = () => {
    if (newCategory && !existingCategories.includes(newCategory)) {
      setCategory(newCategory);
      setIsAddingNewCategory(false);
      setNewCategory('');
    }
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Form validation
    if (!formData.url) {
      setError('URL is required');
      return;
    }

    if (!formData.title) {
      setError('Title is required');
      return;
    }

    // Here you would typically send the updated data to your backend
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setMessage('Bookmark updated successfully!');
      
      // In a real app, you might redirect to the bookmarks list after a successful update
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border text-blue-500" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-gray-600">Loading bookmark data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Bookmark</h1>
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          {message && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              <p className="text-sm">{message}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* URL Field */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="https://example.com"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter bookmark title"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Description Field */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description/Notes
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Add notes about this bookmark"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            
            {/* Tags Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="mb-2 flex flex-wrap gap-2">
                {existingTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedTags.includes(tag) 
                        ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                        : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Add a new tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddNewTag}
                  className="bg-gray-200 px-4 py-2 border border-gray-300 border-l-0 rounded-r-md hover:bg-gray-300"
                >
                  Add
                </button>
              </div>
              {selectedTags.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Selected tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map(tag => (
                      <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {tag}
                        <button
                          type="button"
                          onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                          className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600 focus:outline-none"
                        >
                          <span className="sr-only">Remove tag {tag}</span>
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Category Selection */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              {!isAddingNewCategory ? (
                <select
                  id="category"
                  value={category}
                  onChange={handleCategoryChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {existingCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="add_new">+ Add new category</option>
                </select>
              ) : (
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter new category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewCategory}
                    className="bg-gray-200 px-4 py-2 border border-gray-300 border-l-0 rounded-r-md hover:bg-gray-300"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNewCategory(false);
                      setNewCategory('');
                    }}
                    className="ml-2 bg-gray-200 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            
            {/* Button Group */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isSaving}
                className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
                  isSaving ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSaving ? 'Saving...' : 'Update Bookmark'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBookmark;
