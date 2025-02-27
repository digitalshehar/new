// Path: c:\files\astro\ffw\src\components\admin\NutritionalData.tsx

import React, { useState } from 'react';

export interface NutritionInfo {
  calories?: number;
  servingSize?: string;
  servingsPerRecipe?: number;
  fat?: number;
  saturatedFat?: number;
  transFat?: number;
  cholesterol?: number;
  sodium?: number;
  carbohydrates?: number;
  fiber?: number;
  sugars?: number;
  protein?: number;
}

interface Props {
  nutritionInfo: NutritionInfo;
  onChange: (data: NutritionInfo) => void;
  readOnly?: boolean;
}

const NutritionalData: React.FC<Props> = ({ nutritionInfo, onChange, readOnly = false }) => {
  const [showAllFields, setShowAllFields] = useState(false);

  const handleChange = (field: keyof NutritionInfo, value: string) => {
    if (readOnly) return;
    
    // Convert numeric values and handle empty strings
    const numericValue = value.trim() === '' ? undefined : parseFloat(value);
    
    // Update if it's a valid number or undefined (empty)
    if (numericValue === undefined || !isNaN(numericValue)) {
      onChange({
        ...nutritionInfo,
        [field]: field === 'servingSize' ? value : numericValue
      });
    }
  };

  // Basic fields always shown
  const basicFields = [
    { id: 'calories', label: 'Calories', unit: '' },
    { id: 'servingSize', label: 'Serving Size', unit: '', type: 'text' },
    { id: 'servingsPerRecipe', label: 'Servings Per Recipe', unit: '' },
  ];

  // Advanced fields shown when expanded
  const advancedFields = [
    { id: 'fat', label: 'Total Fat', unit: 'g' },
    { id: 'saturatedFat', label: 'Saturated Fat', unit: 'g' },
    { id: 'transFat', label: 'Trans Fat', unit: 'g' },
    { id: 'cholesterol', label: 'Cholesterol', unit: 'mg' },
    { id: 'sodium', label: 'Sodium', unit: 'mg' },
    { id: 'carbohydrates', label: 'Total Carbohydrates', unit: 'g' },
    { id: 'fiber', label: 'Dietary Fiber', unit: 'g' },
    { id: 'sugars', label: 'Sugars', unit: 'g' },
    { id: 'protein', label: 'Protein', unit: 'g' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {basicFields.map(field => (
          <div key={field.id} className="space-y-1">
            <label 
              htmlFor={field.id} 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {field.label}
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type={field.type || 'number'}
                id={field.id}
                value={nutritionInfo[field.id as keyof NutritionInfo] || ''}
                onChange={(e) => handleChange(field.id as keyof NutritionInfo, e.target.value)}
                className="focus:ring-jamie-orange focus:border-jamie-orange block w-full pl-3 pr-8 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md disabled:opacity-70 disabled:cursor-not-allowed"
                placeholder={field.label}
                step="0.1"
                disabled={readOnly}
              />
              {field.unit && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400 sm:text-sm">{field.unit}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showAllFields && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {advancedFields.map(field => (
              <div key={field.id} className="space-y-1">
                <label 
                  htmlFor={field.id} 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {field.label}
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="number"
                    id={field.id}
                    value={nutritionInfo[field.id as keyof NutritionInfo] || ''}
                    onChange={(e) => handleChange(field.id as keyof NutritionInfo, e.target.value)}
                    className="focus:ring-jamie-orange focus:border-jamie-orange block w-full pl-3 pr-8 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md disabled:opacity-70 disabled:cursor-not-allowed"
                    placeholder={field.label}
                    step="0.1"
                    disabled={readOnly}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 sm:text-sm">{field.unit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!readOnly && (
        <button
          type="button"
          onClick={() => setShowAllFields(!showAllFields)}
          className="text-jamie-orange hover:text-amber-600 text-sm flex items-center mt-2"
        >
          {showAllFields ? (
            <>
              <svg className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Show less fields
            </>
          ) : (
            <>
              <svg className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Show more nutritional fields
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default NutritionalData;
