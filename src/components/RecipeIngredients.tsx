import React, { useState } from 'react';

interface Ingredient {
  category: string;
  items: string[];
}

interface RecipeIngredientsProps {
  ingredients: Ingredient[];
  servings: number;
}

export default function RecipeIngredients({ ingredients, servings }: RecipeIngredientsProps) {
  const [currentServings, setCurrentServings] = useState(servings);

  const adjustServings = (newServings: number) => {
    setCurrentServings(newServings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Ingredients</h2>
        <div className="flex items-center space-x-4 mb-6">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Adjust servings:
          </label>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => adjustServings(Math.max(1, currentServings - 1))}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Decrease servings"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-lg font-semibold w-8 text-center">{currentServings}</span>
            <button
              onClick={() => adjustServings(currentServings + 1)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Increase servings"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {ingredients.map((section, index) => (
        <div key={index} className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {section.category}
          </h3>
          <ul className="space-y-2">
            {section.items.map((item, itemIndex) => {
              // Simple scaling for quantities
              const scaledItem = item.replace(
                /(\d+(\.\d+)?)/g,
                (match) => {
                  const num = parseFloat(match);
                  return ((num * currentServings) / servings).toFixed(
                    match.includes('.') ? 1 : 0
                  );
                }
              );

              return (
                <li
                  key={itemIndex}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
                >
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{scaledItem}</span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <div className="mt-4">
        <button
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          onClick={() => window.print()}
        >
          Print Shopping List
        </button>
      </div>
    </div>
  );
}
