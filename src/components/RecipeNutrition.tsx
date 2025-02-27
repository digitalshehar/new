import React from 'react';

interface NutritionInfo {
  servingSize: string;
  calories: number;
  protein: string;
  carbohydrates: string;
  fat: string;
  saturatedFat: string;
  fiber: string;
  sodium: string;
}

interface RecipeNutritionProps {
  nutrition: NutritionInfo;
}

export default function RecipeNutrition({ nutrition }: RecipeNutritionProps) {
  const nutritionItems = [
    { label: 'Calories', value: nutrition.calories },
    { label: 'Protein', value: nutrition.protein },
    { label: 'Carbohydrates', value: nutrition.carbohydrates },
    { label: 'Fat', value: nutrition.fat },
    { label: 'Saturated Fat', value: nutrition.saturatedFat },
    { label: 'Fiber', value: nutrition.fiber },
    { label: 'Sodium', value: nutrition.sodium },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Nutrition Information</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Per serving ({nutrition.servingSize})
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {nutritionItems.map((item) => (
          <div
            key={item.label}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {item.label}
            </dt>
            <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
              {item.value}
            </dd>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        * Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs.
      </p>
    </div>
  );
}
