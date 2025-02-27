import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Ingredient {
  amount: number;
  unit: string;
  item: string;
}

interface RecipeScalerProps {
  originalServings: number;
  ingredients: string[];
}

export default function RecipeScaler({ originalServings, ingredients }: RecipeScalerProps) {
  const [servings, setServings] = useState(originalServings);
  const [parsedIngredients, setParsedIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    // Parse ingredients on component mount
    const parsed = ingredients.map(ingredient => parseIngredient(ingredient));
    setParsedIngredients(parsed);
  }, [ingredients]);

  function parseIngredient(ingredient: string): Ingredient {
    // Regular expression to match common ingredient formats
    const regex = /^([\d./]+)?\s*([\w.]+)?\s+(.+)$/;
    const match = ingredient.match(regex);

    if (match) {
      const [, amount, unit, item] = match;
      return {
        amount: amount ? convertFractionToDecimal(amount) : 1,
        unit: unit || '',
        item: item.trim()
      };
    }

    return {
      amount: 1,
      unit: '',
      item: ingredient.trim()
    };
  }

  function convertFractionToDecimal(fraction: string): number {
    if (fraction.includes('/')) {
      const [numerator, denominator] = fraction.split('/');
      return parseFloat(numerator) / parseFloat(denominator);
    }
    return parseFloat(fraction);
  }

  function formatAmount(amount: number): string {
    if (amount === 0) return '0';
    if (amount === 1) return '1';
    
    // Convert to fraction if close to common fractions
    const fractions: [number, string][] = [
      [0.25, '¼'],
      [0.33, '⅓'],
      [0.5, '½'],
      [0.67, '⅔'],
      [0.75, '¾']
    ];

    for (const [decimal, fraction] of fractions) {
      if (Math.abs(amount % 1 - decimal) < 0.01) {
        const whole = Math.floor(amount);
        return whole > 0 ? `${whole} ${fraction}` : fraction;
      }
    }

    // Round to 2 decimal places
    return amount.toFixed(2).replace(/\.?0+$/, '');
  }

  function scaleIngredient(ingredient: Ingredient, scale: number): string {
    const scaledAmount = ingredient.amount * scale;
    const formattedAmount = formatAmount(scaledAmount);
    
    if (ingredient.unit) {
      // Handle plural units
      const unit = scaledAmount === 1 ? ingredient.unit : ingredient.unit + 's';
      return `${formattedAmount} ${unit} ${ingredient.item}`;
    }
    
    return `${formattedAmount} ${ingredient.item}`;
  }

  const scale = servings / originalServings;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Adjust Servings
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setServings(Math.max(1, servings - 1))}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="text-lg font-medium min-w-[3ch] text-center">
            {servings}
          </span>
          <button
            onClick={() => setServings(servings + 1)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {parsedIngredients.map((ingredient, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between py-2 border-b dark:border-gray-700 last:border-0"
          >
            <span className="text-gray-900 dark:text-white">
              {scaleIngredient(ingredient, scale)}
            </span>
            {scale !== 1 && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                (originally {scaleIngredient(ingredient, 1)})
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {scale !== 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-sm text-amber-800 dark:text-amber-200"
        >
          <p>
            ⚠️ Cooking times may need to be adjusted when scaling recipes.
            Keep an eye on your food while cooking!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
