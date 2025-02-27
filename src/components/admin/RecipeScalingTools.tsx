// Path: c:\files\astro\ffw\src\components\admin\RecipeScalingTools.tsx

import React, { useState } from 'react';
import { Ingredient } from './StructuredIngredientEditor';

interface Props {
  initialServings: number;
  ingredients: Ingredient[];
  onScaleIngredients: (scaledIngredients: Ingredient[]) => void;
  onUpdateServings: (newServingCount: number) => void;
}

const RecipeScalingTools: React.FC<Props> = ({ 
  initialServings, 
  ingredients, 
  onScaleIngredients,
  onUpdateServings
}) => {
  const [servings, setServings] = useState(initialServings || 4);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [conversionMode, setConversionMode] = useState<'metric' | 'imperial'>('metric');
  
  // Quick scale factors
  const quickScaleFactors = [0.5, 1, 2, 3];

  // Apply scaling to ingredients
  const handleScaleIngredients = (factor: number) => {
    setScaleFactor(factor);
    
    // Calculate new servings
    const newServings = Math.round(initialServings * factor);
    setServings(newServings);
    onUpdateServings(newServings);
    
    // Scale ingredients
    const scaledIngredients = ingredients.map(ing => {
      // Don't scale headings or ingredients without amounts
      if (ing.isHeading || !ing.amount || isNaN(parseFloat(ing.amount))) {
        return ing;
      }
      
      // Parse the amount and scale it
      const amount = parseFloat(ing.amount);
      let scaledAmount = (amount * factor).toFixed(2);
      
      // Remove trailing zeros after decimal
      scaledAmount = scaledAmount.replace(/\.?0+$/, '');
      
      return {
        ...ing,
        amount: scaledAmount
      };
    });
    
    onScaleIngredients(scaledIngredients);
  };

  // Handle custom servings change
  const handleServingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newServings = parseInt(e.target.value);
    if (isNaN(newServings) || newServings <= 0) return;
    
    setServings(newServings);
    
    // Calculate the scale factor based on the new servings
    const newFactor = newServings / initialServings;
    setScaleFactor(newFactor);
    
    // Scale ingredients with the new factor
    handleScaleIngredients(newFactor);
  };

  // Toggle between metric and imperial measurements
  const toggleMeasurementSystem = () => {
    const newMode = conversionMode === 'metric' ? 'imperial' : 'metric';
    setConversionMode(newMode);
    
    // Convert units based on the new measurement system
    const convertedIngredients = ingredients.map(ing => {
      if (ing.isHeading || !ing.amount || !ing.unit) return ing;
      
      let newUnit = ing.unit;
      let newAmount = ing.amount;
      
      // Convert based on unit type
      if (newMode === 'metric') {
        // Convert from imperial to metric
        if (ing.unit === 'cup') {
          newUnit = 'ml';
          newAmount = (parseFloat(ing.amount) * 236.588).toFixed(0);
        } else if (ing.unit === 'oz') {
          newUnit = 'g';
          newAmount = (parseFloat(ing.amount) * 28.3495).toFixed(0);
        } else if (ing.unit === 'lb') {
          newUnit = 'kg';
          newAmount = (parseFloat(ing.amount) * 0.453592).toFixed(2);
        } else if (ing.unit === 'tablespoon') {
          newUnit = 'ml';
          newAmount = (parseFloat(ing.amount) * 14.7868).toFixed(0);
        } else if (ing.unit === 'teaspoon') {
          newUnit = 'ml';
          newAmount = (parseFloat(ing.amount) * 4.92892).toFixed(0);
        } else if (ing.unit === 'gallon') {
          newUnit = 'liter';
          newAmount = (parseFloat(ing.amount) * 3.78541).toFixed(2);
        } else if (ing.unit === 'quart') {
          newUnit = 'liter';
          newAmount = (parseFloat(ing.amount) * 0.946353).toFixed(2);
        } else if (ing.unit === 'pint') {
          newUnit = 'ml';
          newAmount = (parseFloat(ing.amount) * 473.176).toFixed(0);
        } else if (ing.unit === 'inch') {
          newUnit = 'cm';
          newAmount = (parseFloat(ing.amount) * 2.54).toFixed(1);
        }
      } else {
        // Convert from metric to imperial
        if (ing.unit === 'ml') {
          // Small amounts to teaspoons
          if (parseFloat(ing.amount) < 15) {
            newUnit = 'teaspoon';
            newAmount = (parseFloat(ing.amount) / 4.92892).toFixed(1);
          } 
          // Medium amounts to tablespoons
          else if (parseFloat(ing.amount) < 100) {
            newUnit = 'tablespoon';
            newAmount = (parseFloat(ing.amount) / 14.7868).toFixed(1);
          } 
          // Large amounts to cups
          else {
            newUnit = 'cup';
            newAmount = (parseFloat(ing.amount) / 236.588).toFixed(2);
          }
        } else if (ing.unit === 'l' || ing.unit === 'liter') {
          newUnit = 'cup';
          newAmount = (parseFloat(ing.amount) * 4.22675).toFixed(2);
        } else if (ing.unit === 'g') {
          newUnit = 'oz';
          newAmount = (parseFloat(ing.amount) / 28.3495).toFixed(1);
        } else if (ing.unit === 'kg') {
          newUnit = 'lb';
          newAmount = (parseFloat(ing.amount) / 0.453592).toFixed(2);
        } else if (ing.unit === 'cm') {
          newUnit = 'inch';
          newAmount = (parseFloat(ing.amount) / 2.54).toFixed(1);
        }
      }
      
      // Remove trailing zeros after decimal
      newAmount = newAmount.replace(/\.0+$/, '');
      
      return {
        ...ing,
        unit: newUnit,
        amount: newAmount
      };
    });
    
    onScaleIngredients(convertedIngredients);
  };

  return (
    <div className="space-y-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recipe Scaling Tools</h3>
      
      {/* Servings Adjuster */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Adjust Servings
        </label>
        <div className="flex items-center">
          <input
            type="number"
            value={servings}
            onChange={handleServingsChange}
            min="1"
            className="block w-20 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
          />
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">servings</span>
        </div>
      </div>
      
      {/* Quick Scale Buttons */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Quick Scale
        </label>
        <div className="flex flex-wrap gap-2">
          {quickScaleFactors.map(factor => (
            <button
              key={factor}
              onClick={() => handleScaleIngredients(factor)}
              className={`px-3 py-1 text-sm rounded-md ${
                scaleFactor === factor
                  ? 'bg-jamie-orange text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {factor === 0.5 ? '½×' : factor === 1 ? '1×' : `${factor}×`}
            </button>
          ))}
        </div>
      </div>
      
      {/* Measurement System Toggle */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Measurement System
        </label>
        <div className="flex items-center">
          <button
            onClick={toggleMeasurementSystem}
            className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {conversionMode === 'metric' ? (
              <>
                <span>Metric</span>
                <svg className="ml-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </>
            ) : (
              <>
                <span>Imperial</span>
                <svg className="ml-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Tips */}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3">
        <p><strong>Tip:</strong> Cooking times don't scale linearly with recipe size. You may need to adjust cooking times separately.</p>
      </div>
    </div>
  );
};

export default RecipeScalingTools;
