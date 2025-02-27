import React, { useState, useRef, useEffect } from 'react';

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface RecipeTagsProps {
  existingTags: Tag[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  onCreateTag?: (tag: Omit<Tag, 'id'>) => void;
}

const TAG_COLORS = [
  { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', hover: 'hover:bg-red-200' },
  { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', hover: 'hover:bg-blue-200' },
  { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', hover: 'hover:bg-green-200' },
  { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', hover: 'hover:bg-yellow-200' },
  { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200', hover: 'hover:bg-purple-200' },
  { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200', hover: 'hover:bg-pink-200' },
  { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200', hover: 'hover:bg-indigo-200' },
];

// Dark mode variants
const TAG_COLORS_DARK = [
  { bg: 'dark:bg-red-900', text: 'dark:text-red-200', border: 'dark:border-red-800', hover: 'dark:hover:bg-red-800' },
  { bg: 'dark:bg-blue-900', text: 'dark:text-blue-200', border: 'dark:border-blue-800', hover: 'dark:hover:bg-blue-800' },
  { bg: 'dark:bg-green-900', text: 'dark:text-green-200', border: 'dark:border-green-800', hover: 'dark:hover:bg-green-800' },
  { bg: 'dark:bg-yellow-900', text: 'dark:text-yellow-200', border: 'dark:border-yellow-800', hover: 'dark:hover:bg-yellow-800' },
  { bg: 'dark:bg-purple-900', text: 'dark:text-purple-200', border: 'dark:border-purple-800', hover: 'dark:hover:bg-purple-800' },
  { bg: 'dark:bg-pink-900', text: 'dark:text-pink-200', border: 'dark:border-pink-800', hover: 'dark:hover:bg-pink-800' },
  { bg: 'dark:bg-indigo-900', text: 'dark:text-indigo-200', border: 'dark:border-indigo-800', hover: 'dark:hover:bg-indigo-800' },
];

export default function RecipeTags({ existingTags, selectedTags, onTagsChange, onCreateTag }: RecipeTagsProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(0);
  const [dropdownAnimation, setDropdownAnimation] = useState('');
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Focus search input when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isDropdownOpen]);
  
  const openDropdown = () => {
    setIsDropdownOpen(true);
    setDropdownAnimation('animate-scale-in');
  };
  
  const closeDropdown = () => {
    setDropdownAnimation('animate-scale-out');
    setTimeout(() => {
      setIsDropdownOpen(false);
      setSearchTerm('');
      setIsCreatingTag(false);
      setNewTagName('');
    }, 200); // Match animation duration
  };
  
  const toggleTag = (tagId: string) => {
    const updatedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    
    onTagsChange(updatedTags);
  };
  
  const handleCreateTag = () => {
    if (newTagName.trim() && onCreateTag) {
      onCreateTag({
        name: newTagName.trim(),
        color: TAG_COLORS[selectedColor].bg.replace('bg-', '')
      });
      setNewTagName('');
      setIsCreatingTag(false);
    }
  };
  
  const filteredTags = existingTags.filter(tag => 
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getTagColorClasses = (colorName: string) => {
    const colorIndex = TAG_COLORS.findIndex(color => color.bg.includes(colorName));
    if (colorIndex === -1) return `${TAG_COLORS[0].bg} ${TAG_COLORS[0].text} ${TAG_COLORS_DARK[0].bg} ${TAG_COLORS_DARK[0].text}`;
    
    return `${TAG_COLORS[colorIndex].bg} ${TAG_COLORS[colorIndex].text} ${TAG_COLORS_DARK[colorIndex].bg} ${TAG_COLORS_DARK[colorIndex].text}`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.length > 0 && existingTags
          .filter(tag => selectedTags.includes(tag.id))
          .map(tag => (
            <span
              key={tag.id}
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all ${
                getTagColorClasses(tag.color)
              }`}
            >
              {tag.name}
              <button
                type="button"
                onClick={() => toggleTag(tag.id)}
                className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        
        <button
          type="button"
          onClick={openDropdown}
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-all border border-gray-200 dark:border-gray-600"
        >
          <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Tags
        </button>
      </div>
      
      {isDropdownOpen && (
        <div 
          className={`absolute z-10 mt-1 w-full max-w-xs bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${dropdownAnimation}`}
          style={{ minWidth: '240px' }}
        >
          <div className="p-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:focus:ring-amber-400"
                ref={searchInputRef}
              />
              {searchTerm && (
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
                  onClick={() => setSearchTerm('')}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            <div className="mt-2 max-h-48 overflow-y-auto">
              {filteredTags.length > 0 ? (
                <div className="space-y-1">
                  {filteredTags.map(tag => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`w-full text-left px-3 py-1.5 text-sm rounded flex items-center justify-between transition-colors ${
                        selectedTags.includes(tag.id)
                          ? 'bg-amber-50 text-amber-900 dark:bg-amber-900 dark:bg-opacity-20 dark:text-amber-100'
                          : 'hover:bg-gray-100 text-gray-700 dark:text-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span 
                          className={`h-3 w-3 rounded-full ${
                            getTagColorClasses(tag.color)
                          }`}
                        ></span>
                        <span>{tag.name}</span>
                      </div>
                      
                      {selectedTags.includes(tag.id) && (
                        <svg className="h-4 w-4 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                  {searchTerm ? (
                    <div>
                      <p>No tags found for "{searchTerm}"</p>
                      {onCreateTag && (
                        <button
                          type="button"
                          onClick={() => {
                            setNewTagName(searchTerm);
                            setIsCreatingTag(true);
                          }}
                          className="mt-1 text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-medium"
                        >
                          + Create new tag
                        </button>
                      )}
                    </div>
                  ) : (
                    <p>No tags available</p>
                  )}
                </div>
              )}
            </div>
            
            {isCreatingTag ? (
              <div className="mt-3 p-3 border-t border-gray-200 dark:border-gray-700">
                <div className="mb-2">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Tag Name
                  </label>
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 dark:focus:ring-amber-400"
                    autoFocus
                  />
                </div>
                
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tag Color
                  </label>
                  <div className="flex gap-1.5 flex-wrap">
                    {TAG_COLORS.map((color, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedColor(index)}
                        className={`h-6 w-6 rounded-full transition-all ${color.bg} ${TAG_COLORS_DARK[index].bg} ${
                          selectedColor === index ? 'ring-2 ring-offset-2 ring-amber-500 dark:ring-amber-400 scale-110' : ''
                        }`}
                      ></button>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setIsCreatingTag(false)}
                    className="px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateTag}
                    disabled={!newTagName.trim()}
                    className={`px-3 py-1.5 text-xs rounded transition-colors ${
                      newTagName.trim()
                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                        : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Create Tag
                  </button>
                </div>
              </div>
            ) : onCreateTag && (
              <div className="mt-3 p-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsCreatingTag(true)}
                  className="w-full px-3 py-1.5 text-xs text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-medium text-center"
                >
                  + Create new tag
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
