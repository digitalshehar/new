import { useState, useEffect } from 'react';

interface FilterProps {
  onFilterChange: (filters: FilterState) => void;
  categories: string[];
  difficulties: string[];
}

export interface FilterState {
  searchTerm: string;
  categories: string[];
  difficulties: string[];
  minCookTime: number | null;
  maxCookTime: number | null;
  sortBy: 'title' | 'newest' | 'cookTime' | 'difficulty';
  sortDirection: 'asc' | 'desc';
}

export default function RecipeFilters({ onFilterChange, categories, difficulties }: FilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    categories: [],
    difficulties: [],
    minCookTime: null,
    maxCookTime: null,
    sortBy: 'title',
    sortDirection: 'asc'
  });
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Animation states
  const [animateSearchBar, setAnimateSearchBar] = useState(false);
  
  useEffect(() => {
    // Notify parent component when filters change
    onFilterChange(filters);
  }, [filters, onFilterChange]);
  
  useEffect(() => {
    // Trigger search bar animation
    setAnimateSearchBar(true);
    const timer = setTimeout(() => setAnimateSearchBar(false), 600);
    return () => clearTimeout(timer);
  }, []);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchTerm: e.target.value }));
  };
  
  const toggleCategory = (category: string) => {
    setFilters(prev => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories: newCategories };
    });
  };
  
  const toggleDifficulty = (difficulty: string) => {
    setFilters(prev => {
      const newDifficulties = prev.difficulties.includes(difficulty)
        ? prev.difficulties.filter(d => d !== difficulty)
        : [...prev.difficulties, difficulty];
      return { ...prev, difficulties: newDifficulties };
    });
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as FilterState['sortBy'];
    setFilters(prev => ({ ...prev, sortBy: value }));
  };
  
  const toggleSortDirection = () => {
    setFilters(prev => ({
      ...prev,
      sortDirection: prev.sortDirection === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      categories: [],
      difficulties: [],
      minCookTime: null,
      maxCookTime: null,
      sortBy: 'title',
      sortDirection: 'asc'
    });
  };
  
  const appliedFiltersCount = [
    filters.searchTerm !== '',
    filters.categories.length > 0,
    filters.difficulties.length > 0,
    filters.minCookTime !== null || filters.maxCookTime !== null,
    filters.sortBy !== 'title' || filters.sortDirection !== 'asc'
  ].filter(Boolean).length;

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden transition-all duration-300">
      {/* Search bar */}
      <div className={`relative p-4 ${animateSearchBar ? 'animate-pulse' : ''}`}>
        <div 
          className={`relative transition-all duration-300 ${
            isSearchFocused ? 'ring-2 ring-amber-500 shadow-lg' : ''
          }`}
        >
          <input
            type="text"
            placeholder="Search recipes..."
            value={filters.searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {filters.searchTerm && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, searchTerm: '' }))}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-gray-600 dark:text-gray-300 flex items-center hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
          >
            <span>{isExpanded ? 'Hide filters' : 'Show filters'}</span>
            <svg
              className={`ml-1 h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {appliedFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
            >
              Reset filters ({appliedFiltersCount})
            </button>
          )}
        </div>
      </div>
      
      {/* Expanded filters */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Categories */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 transform hover:scale-105 ${
                    filters.categories.includes(category)
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Difficulties */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Difficulty</h3>
            <div className="flex flex-wrap gap-2">
              {difficulties.map(difficulty => (
                <button
                  key={difficulty}
                  onClick={() => toggleDifficulty(difficulty)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 transform hover:scale-105 ${
                    filters.difficulties.includes(difficulty)
                      ? difficulty === 'Easy' 
                        ? 'bg-green-500 text-white'
                        : difficulty === 'Medium'
                          ? 'bg-amber-500 text-white'
                          : 'bg-red-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>
          
          {/* Sorting */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Sort by</h3>
            <div className="flex items-center">
              <select
                value={filters.sortBy}
                onChange={handleSortChange}
                className="rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white mr-2 py-1 px-2 text-sm"
              >
                <option value="title">Name</option>
                <option value="newest">Date Added</option>
                <option value="cookTime">Cook Time</option>
                <option value="difficulty">Difficulty</option>
              </select>
              
              <button
                onClick={toggleSortDirection}
                className="p-1 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {filters.sortDirection === 'asc' ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Active filters summary */}
      {appliedFiltersCount > 0 && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">Active filters:</span>
          
          {filters.searchTerm && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              Search: {filters.searchTerm}
              <button 
                onClick={() => setFilters(prev => ({ ...prev, searchTerm: '' }))}
                className="ml-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          
          {filters.categories.map(category => (
            <span 
              key={category}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
            >
              {category}
              <button 
                onClick={() => toggleCategory(category)}
                className="ml-1 text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-200"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
          
          {filters.difficulties.map(difficulty => (
            <span 
              key={difficulty}
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                ${difficulty === 'Easy' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                  : difficulty === 'Medium'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                }`}
            >
              {difficulty}
              <button 
                onClick={() => toggleDifficulty(difficulty)}
                className={`ml-1 
                  ${difficulty === 'Easy' 
                    ? 'text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-200' 
                    : difficulty === 'Medium'
                      ? 'text-amber-500 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-200'
                      : 'text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200'
                  }`}
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
          
          {(filters.sortBy !== 'title' || filters.sortDirection !== 'asc') && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
              Sort: {filters.sortBy} ({filters.sortDirection === 'asc' ? '↑' : '↓'})
            </span>
          )}
        </div>
      )}
    </div>
  );
}
