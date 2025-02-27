import React, { useState } from 'react';

interface Recipe {
  title: string;
  slug: string;
  category: string;
  cookingTime: string;
  difficulty: string;
}

interface BatchOperationsProps {
  selectedRecipes: Recipe[];
  onBatchDelete: () => void;
  onBatchCategory: (category: string) => void;
  onBatchExport: () => void;
  onClearSelection: () => void;
  categories: string[];
}

export default function BatchOperations({
  selectedRecipes,
  onBatchDelete,
  onBatchCategory,
  onBatchExport,
  onClearSelection,
  categories
}: BatchOperationsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  if (selectedRecipes.length === 0) return null;
  
  const handleBatchDelete = () => {
    setShowConfirmation(true);
  };
  
  const confirmBatchDelete = () => {
    onBatchDelete();
    setShowConfirmation(false);
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };
  
  const applyCategory = () => {
    if (selectedCategory) {
      onBatchCategory(selectedCategory);
      setSelectedCategory('');
    }
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-20 transition-transform duration-300 transform ${
      isOpen ? 'translate-y-0' : 'translate-y-[90%]'
    }`}>
      <div 
        className="cursor-pointer bg-gray-800 dark:bg-gray-900 text-white py-2 px-4 flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-white text-xs">
            {selectedRecipes.length}
          </span>
          <span>recipes selected</span>
        </div>
        
        <svg 
          className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </div>
      
      <div className="bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="text-gray-700 dark:text-gray-300 text-sm">Selected recipes:</span>
            <div className="flex flex-wrap gap-2 max-w-md overflow-auto">
              {selectedRecipes.map(recipe => (
                <span 
                  key={recipe.slug}
                  className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-md"
                >
                  {recipe.title}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onClearSelection}
              className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Clear selection
            </button>
            
            <div className="flex items-center">
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded py-1 px-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              >
                <option value="">Change category...</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <button
                onClick={applyCategory}
                disabled={!selectedCategory}
                className={`ml-2 text-sm py-1 px-3 rounded-md transition-colors ${
                  selectedCategory
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                Apply
              </button>
            </div>
            
            <button
              onClick={onBatchExport}
              className="text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md transition-colors flex items-center gap-1"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
            
            <button
              onClick={handleBatchDelete}
              className="text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md transition-colors flex items-center gap-1"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete All
            </button>
          </div>
        </div>
      </div>
      
      {/* Confirmation modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-30">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full animate-scale">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete these {selectedRecipes.length} recipes? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmBatchDelete}
                className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
