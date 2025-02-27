import { useState } from 'react';
import { motion } from 'framer-motion';

interface IngredientsListProps {
  ingredients: string[];
  servings: string;
}

export default function IngredientsList({ ingredients, servings }: IngredientsListProps) {
  const [currentServings, setCurrentServings] = useState(parseInt(servings) || 4);
  const baseServings = parseInt(servings) || 4;
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  const toggleIngredient = (index: number) => {
    setCheckedItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const adjustQuantity = (ingredient: string, ratio: number): string => {
    const regex = /^([\d./]+)\s*(.+)$/;
    const match = ingredient.match(regex);
    
    if (!match) return ingredient;
    
    const [, quantity, rest] = match;
    let numericQuantity: number;

    if (quantity.includes('/')) {
      const [numerator, denominator] = quantity.split('/');
      numericQuantity = parseFloat(numerator) / parseFloat(denominator);
    } else {
      numericQuantity = parseFloat(quantity);
    }

    if (isNaN(numericQuantity)) return ingredient;

    const adjustedQuantity = numericQuantity * ratio;
    
    // Format the adjusted quantity
    let formattedQuantity: string;
    if (adjustedQuantity < 1 && adjustedQuantity > 0) {
      // Convert to fraction for small quantities
      if (adjustedQuantity === 0.25) formattedQuantity = '¼';
      else if (adjustedQuantity === 0.5) formattedQuantity = '½';
      else if (adjustedQuantity === 0.75) formattedQuantity = '¾';
      else if (adjustedQuantity === 0.33) formattedQuantity = '⅓';
      else if (adjustedQuantity === 0.67) formattedQuantity = '⅔';
      else formattedQuantity = adjustedQuantity.toFixed(2);
    } else {
      // Round to nearest 0.5 for larger quantities
      formattedQuantity = (Math.round(adjustedQuantity * 2) / 2).toString();
    }

    return `${formattedQuantity} ${rest}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
    >
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Ingredients</h3>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          Adjust servings
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentServings(Math.max(1, currentServings - 1))}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
            </svg>
          </button>
          <span className="text-lg font-medium min-w-[3ch] text-center">
            {currentServings}
          </span>
          <button
            onClick={() => setCurrentServings(currentServings + 1)}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      <ul className="space-y-3">
        {ingredients.map((ingredient, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-start gap-3 p-2 rounded-lg transition-colors ${
              checkedItems.includes(index)
                ? 'bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
          >
            <button
              onClick={() => toggleIngredient(index)}
              className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded border transition-colors ${
                checkedItems.includes(index)
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              {checkedItems.includes(index) && (
                <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
            <span className={checkedItems.includes(index) ? 'line-through' : ''}>
              {adjustQuantity(ingredient, currentServings / baseServings)}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
