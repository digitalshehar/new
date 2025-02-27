import React, { useState } from 'react';

interface Ingredient {
  amount: string;
  unit: string;
  name: string;
  notes?: string;
}

interface Instruction {
  step: number;
  description: string;
}

interface RecipePreviewProps {
  recipe: {
    title: string;
    description: string;
    image?: string;
    prepTime?: string;
    cookingTime?: string;
    totalTime?: string;
    serves?: string;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    ingredients: string[] | Ingredient[];
    instructions: string[] | Instruction[];
    category?: string;
    tags?: string[];
    notes?: string[];
    tips?: string[];
  };
  onClose: () => void;
}

const RecipePreview: React.FC<RecipePreviewProps> = ({ recipe, onClose }) => {
  const [activeTab, setActiveTab] = useState<'mobile' | 'desktop'>('desktop');
  
  // Helper function to format ingredients properly based on data structure
  const renderIngredient = (ingredient: string | Ingredient, index: number) => {
    if (typeof ingredient === 'string') {
      return <li key={index} className="mb-2">{ingredient}</li>;
    } else {
      return (
        <li key={index} className="mb-2">
          {ingredient.amount && <span className="font-medium">{ingredient.amount} </span>}
          {ingredient.unit && <span>{ingredient.unit} </span>}
          <span>{ingredient.name}</span>
          {ingredient.notes && <span className="text-gray-500 italic"> ({ingredient.notes})</span>}
        </li>
      );
    }
  };
  
  // Helper function to format instructions properly based on data structure
  const renderInstruction = (instruction: string | Instruction, index: number) => {
    if (typeof instruction === 'string') {
      return (
        <li key={index} className="mb-4 pl-8 relative">
          <span className="absolute left-0 top-0 bg-jamie-orange text-white rounded-full w-6 h-6 flex items-center justify-center">{index + 1}</span>
          {instruction}
        </li>
      );
    } else {
      return (
        <li key={index} className="mb-4 pl-8 relative">
          <span className="absolute left-0 top-0 bg-jamie-orange text-white rounded-full w-6 h-6 flex items-center justify-center">{instruction.step}</span>
          {instruction.description}
        </li>
      );
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Preview Header */}
        <div className="bg-jamie-orange text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Recipe Preview</h2>
          <div className="flex items-center space-x-4">
            {/* View Switcher */}
            <div className="bg-white bg-opacity-20 rounded-lg p-1 flex">
              <button 
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'mobile' 
                    ? 'bg-white text-jamie-orange shadow' 
                    : 'text-white hover:bg-white hover:bg-opacity-10'
                }`}
                onClick={() => setActiveTab('mobile')}
              >
                Mobile
              </button>
              <button 
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'desktop' 
                    ? 'bg-white text-jamie-orange shadow' 
                    : 'text-white hover:bg-white hover:bg-opacity-10'
                }`}
                onClick={() => setActiveTab('desktop')}
              >
                Desktop
              </button>
            </div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Preview Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className={`mx-auto transition-all duration-300 ${
            activeTab === 'mobile' ? 'max-w-sm border-x border-gray-200 dark:border-gray-700 shadow-inner' : 'max-w-5xl'
          }`}>
            {/* Recipe Title and Description */}
            <div className="relative">
              {recipe.image ? (
                <div className="w-full aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-6">
                  <img 
                    src={recipe.image} 
                    alt={recipe.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x450?text=Recipe+Image';
                    }}
                  />
                </div>
              ) : (
                <div className="w-full aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-6 flex items-center justify-center">
                  <span className="text-gray-400 dark:text-gray-500">No Image</span>
                </div>
              )}
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{recipe.title}</h1>
              <p className="text-gray-700 dark:text-gray-300 mb-6">{recipe.description}</p>
              
              {/* Recipe Meta Info */}
              <div className="flex flex-wrap gap-4 mb-8">
                {recipe.prepTime && (
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-jamie-orange mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Prep:</span> {recipe.prepTime}
                    </span>
                  </div>
                )}
                
                {recipe.cookingTime && (
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-jamie-orange mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Cook:</span> {recipe.cookingTime}
                    </span>
                  </div>
                )}
                
                {recipe.totalTime && (
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-jamie-orange mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Total:</span> {recipe.totalTime}
                    </span>
                  </div>
                )}
                
                {recipe.serves && (
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-jamie-orange mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Serves:</span> {recipe.serves}
                    </span>
                  </div>
                )}
                
                {recipe.difficulty && (
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-jamie-orange mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Difficulty:</span> {recipe.difficulty}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Recipe Ingredients and Instructions */}
            <div className={`grid gap-8 ${activeTab === 'desktop' ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
              <div className={`${activeTab === 'desktop' ? 'lg:col-span-1' : ''}`}>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg className="h-5 w-5 text-jamie-orange mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  Ingredients
                </h2>
                <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300">
                  {recipe.ingredients && recipe.ingredients.map((ingredient, idx) => renderIngredient(ingredient, idx))}
                </ul>
              </div>
              
              <div className={`${activeTab === 'desktop' ? 'lg:col-span-2' : ''}`}>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg className="h-5 w-5 text-jamie-orange mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                  Instructions
                </h2>
                <ol className="list-none text-gray-700 dark:text-gray-300">
                  {recipe.instructions && recipe.instructions.map((instruction, idx) => renderInstruction(instruction, idx))}
                </ol>
              </div>
            </div>
            
            {/* Recipe Notes and Tips */}
            {(recipe.notes?.length || recipe.tips?.length) && (
              <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-6">
                {recipe.notes?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Notes</h3>
                    <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2">
                      {recipe.notes.map((note, idx) => (
                        <li key={idx}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {recipe.tips?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Tips</h3>
                    <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2">
                      {recipe.tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {/* Recipe Tags and Category */}
            {(recipe.tags?.length || recipe.category) && (
              <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex flex-wrap gap-2">
                  {recipe.category && (
                    <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full text-sm">
                      {recipe.category}
                    </span>
                  )}
                  
                  {recipe.tags?.map((tag, idx) => (
                    <span key={idx} className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer with disclaimer */}
        <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
          This is a preview of how the recipe will appear. Some elements may look different on the live site.
        </div>
      </div>
    </div>
  );
};

export default RecipePreview;
