import React, { useState, useEffect } from 'react';

interface Recipe {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  featuredImage?: string;
  cuisine?: string;
  course?: string;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  slug: string;
  featured: boolean;
  recipeIds: string[];
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  recipes: Recipe[];
  collections: Collection[];
  onSaveCollection: (collection: Collection) => void;
  onDeleteCollection: (collectionId: string) => void;
}

const RecipeCollections: React.FC<Props> = ({
  recipes,
  collections = [],
  onSaveCollection,
  onDeleteCollection
}) => {
  const [activeCollection, setActiveCollection] = useState<Collection | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // Form state
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formRecipeIds, setFormRecipeIds] = useState<string[]>([]);
  const [formCoverImage, setFormCoverImage] = useState('');
  
  // Reset form when closing modal
  useEffect(() => {
    if (!showModal) {
      setActiveCollection(null);
      setIsEditing(false);
      resetForm();
    }
  }, [showModal]);
  
  // Initialize form when editing
  useEffect(() => {
    if (activeCollection && isEditing) {
      setFormName(activeCollection.name);
      setFormDescription(activeCollection.description);
      setFormSlug(activeCollection.slug);
      setFormFeatured(activeCollection.featured);
      setFormRecipeIds(activeCollection.recipeIds);
      setFormCoverImage(activeCollection.coverImage || '');
    }
  }, [activeCollection, isEditing]);
  
  // Reset form to defaults
  const resetForm = () => {
    setFormName('');
    setFormDescription('');
    setFormSlug('');
    setFormFeatured(false);
    setFormRecipeIds([]);
    setFormCoverImage('');
  };
  
  // Open create collection modal
  const openCreateModal = () => {
    setIsEditing(false);
    setActiveCollection(null);
    resetForm();
    setShowModal(true);
  };
  
  // Open edit collection modal
  const openEditModal = (collection: Collection) => {
    setIsEditing(true);
    setActiveCollection(collection);
    setShowModal(true);
  };
  
  // View collection details
  const viewCollection = (collection: Collection) => {
    setIsEditing(false);
    setActiveCollection(collection);
    setShowModal(true);
  };
  
  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setFormName(name);
    if (!isEditing || !activeCollection) {
      setFormSlug(name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    }
  };
  
  // Toggle recipe selection
  const toggleRecipeSelection = (recipeId: string) => {
    const isSelected = formRecipeIds.includes(recipeId);
    if (isSelected) {
      setFormRecipeIds(formRecipeIds.filter(id => id !== recipeId));
    } else {
      setFormRecipeIds([...formRecipeIds, recipeId]);
    }
  };
  
  // Save collection
  const saveCollection = () => {
    if (!formName || !formSlug) return;
    
    const collection: Collection = {
      id: activeCollection?.id || `col_${Date.now()}`,
      name: formName,
      description: formDescription,
      slug: formSlug,
      featured: formFeatured,
      recipeIds: formRecipeIds,
      coverImage: formCoverImage || undefined,
      createdAt: activeCollection?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    onSaveCollection(collection);
    setShowModal(false);
  };
  
  // Delete collection
  const deleteCollection = () => {
    if (activeCollection) {
      if (confirm(`Are you sure you want to delete "${activeCollection.name}"?`)) {
        onDeleteCollection(activeCollection.id);
        setShowModal(false);
      }
    }
  };
  
  // Get collection stats
  const getCollectionStats = (collection: Collection) => {
    const totalRecipes = collection.recipeIds.length;
    const cuisines = new Set<string>();
    const courses = new Set<string>();
    
    collection.recipeIds.forEach(id => {
      const recipe = recipes.find(r => r.id === id);
      if (recipe) {
        if (recipe.cuisine) cuisines.add(recipe.cuisine);
        if (recipe.course) courses.add(recipe.course);
      }
    });
    
    return {
      totalRecipes,
      uniqueCuisines: cuisines.size,
      uniqueCourses: courses.size
    };
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recipe Collections</h2>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-jamie-orange hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jamie-orange"
          >
            <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Collection
          </button>
        </div>
        
        {/* Collections Grid */}
        {collections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map(collection => {
              const stats = getCollectionStats(collection);
              return (
                <div 
                  key={collection.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {collection.coverImage ? (
                    <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${collection.coverImage})` }} />
                  ) : (
                    <div className="h-32 bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 flex items-center justify-center">
                      <span className="text-xl font-medium text-amber-800 dark:text-amber-100">{collection.name}</span>
                    </div>
                  )}
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {collection.name}
                          {collection.featured && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                              Featured
                            </span>
                          )}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {collection.description || 'No description available.'}
                        </p>
                      </div>
                      <div>
                        <button
                          onClick={() => openEditModal(collection)}
                          className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <div className="flex space-x-4">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">{stats.totalRecipes}</span>
                          <span className="ml-1 text-gray-500 dark:text-gray-400">recipes</span>
                        </div>
                        {stats.uniqueCuisines > 0 && (
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">{stats.uniqueCuisines}</span>
                            <span className="ml-1 text-gray-500 dark:text-gray-400">cuisines</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => viewCollection(collection)}
                        className="inline-flex items-center text-sm font-medium text-jamie-orange hover:text-amber-600"
                      >
                        View details
                        <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 px-4">
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No collections yet</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating a new collection.
            </p>
            <div className="mt-6">
              <button
                onClick={openCreateModal}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-jamie-orange hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jamie-orange"
              >
                New Collection
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Collection Modal */}
      {showModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      {isEditing ? 'Edit Collection' : (activeCollection ? 'Collection Details' : 'Create New Collection')}
                    </h3>
                    
                    {/* View Mode */}
                    {activeCollection && !isEditing && (
                      <div className="mt-4">
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-4">
                          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">{activeCollection.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{activeCollection.description}</p>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Slug: </span>
                              <span className="text-gray-900 dark:text-white">{activeCollection.slug}</span>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Featured: </span>
                              <span className="text-gray-900 dark:text-white">{activeCollection.featured ? 'Yes' : 'No'}</span>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Created: </span>
                              <span className="text-gray-900 dark:text-white">
                                {new Date(activeCollection.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Updated: </span>
                              <span className="text-gray-900 dark:text-white">
                                {new Date(activeCollection.updatedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Recipes in this Collection</h4>
                        {activeCollection.recipeIds.length > 0 ? (
                          <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-48 overflow-y-auto">
                            {activeCollection.recipeIds.map(id => {
                              const recipe = recipes.find(r => r.id === id);
                              return recipe ? (
                                <li key={id} className="py-2 flex items-center">
                                  <span className="text-sm text-gray-900 dark:text-white">{recipe.title}</span>
                                </li>
                              ) : null;
                            })}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            No recipes in this collection yet.
                          </p>
                        )}
                      </div>
                    )}
                    
                    {/* Edit Mode */}
                    {(isEditing || !activeCollection) && (
                      <div className="mt-4">
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={formName}
                              onChange={(e) => handleNameChange(e.target.value)}
                              className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-jamie-orange focus:border-jamie-orange sm:text-sm"
                              placeholder="Breakfast Favorites"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Slug
                            </label>
                            <input
                              type="text"
                              name="slug"
                              id="slug"
                              value={formSlug}
                              onChange={(e) => setFormSlug(e.target.value)}
                              className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-jamie-orange focus:border-jamie-orange sm:text-sm"
                              placeholder="breakfast-favorites"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Description
                            </label>
                            <textarea
                              name="description"
                              id="description"
                              rows={3}
                              value={formDescription}
                              onChange={(e) => setFormDescription(e.target.value)}
                              className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-jamie-orange focus:border-jamie-orange sm:text-sm"
                              placeholder="A collection of our favorite breakfast recipes."
                            ></textarea>
                          </div>
                          
                          <div>
                            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Cover Image URL (optional)
                            </label>
                            <input
                              type="text"
                              name="coverImage"
                              id="coverImage"
                              value={formCoverImage}
                              onChange={(e) => setFormCoverImage(e.target.value)}
                              className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-jamie-orange focus:border-jamie-orange sm:text-sm"
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>
                          
                          <div className="flex items-center">
                            <input
                              id="featured"
                              name="featured"
                              type="checkbox"
                              checked={formFeatured}
                              onChange={(e) => setFormFeatured(e.target.checked)}
                              className="h-4 w-4 text-jamie-orange focus:ring-jamie-orange border-gray-300 dark:border-gray-600 rounded"
                            />
                            <label htmlFor="featured" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                              Featured collection (shown prominently on homepage)
                            </label>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Recipes in this Collection
                            </label>
                            <div className="border border-gray-300 dark:border-gray-600 rounded-md p-2 max-h-60 overflow-y-auto">
                              {recipes.length > 0 ? (
                                recipes.map(recipe => (
                                  <div key={recipe.id} className="flex items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                                    <input
                                      id={`recipe-${recipe.id}`}
                                      name={`recipe-${recipe.id}`}
                                      type="checkbox"
                                      checked={formRecipeIds.includes(recipe.id)}
                                      onChange={() => toggleRecipeSelection(recipe.id)}
                                      className="h-4 w-4 text-jamie-orange focus:ring-jamie-orange border-gray-300 dark:border-gray-600 rounded"
                                    />
                                    <label htmlFor={`recipe-${recipe.id}`} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                      {recipe.title}
                                    </label>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400 py-2">
                                  No recipes available.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {isEditing || !activeCollection ? (
                  <>
                    <button
                      type="button"
                      onClick={saveCollection}
                      disabled={!formName || !formSlug}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-jamie-orange text-base font-medium text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jamie-orange sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isEditing ? 'Update' : 'Create'}
                    </button>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={deleteCollection}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => openEditModal(activeCollection)}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-jamie-orange text-base font-medium text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jamie-orange sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Edit
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeCollections;
