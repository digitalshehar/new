import React, { useState } from 'react';
import StructuredIngredientEditor, { Ingredient } from './StructuredIngredientEditor';
import NutritionalData, { NutritionInfo } from './NutritionalData';
import RecipeScalingTools from './RecipeScalingTools';

interface Recipe {
  id?: string;
  title: string;
  slug?: string;
  description: string;
  featuredImage?: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime?: number;
  cookTime?: number;
  totalTime?: number;
  servings?: number;
  cuisine?: string;
  course?: string;
  notes?: string;
  nutritionInfo?: NutritionInfo;
  keywords?: string[];
  author?: string;
  status?: 'draft' | 'published' | 'scheduled' | 'archived';
  publishDate?: string;
  revisions?: { date: string; author: string; note: string }[];
}

interface Props {
  recipe: Recipe;
  onUpdate: (recipe: Recipe) => void;
  className?: string;
}

const AdvancedRecipeEditor: React.FC<Props> = ({ recipe, onUpdate, className = '' }) => {
  const [activeTab, setActiveTab] = useState<'ingredients' | 'nutrition' | 'scaling'>('ingredients');

  // Handler for ingredient updates
  const handleIngredientsChange = (updatedIngredients: Ingredient[]) => {
    onUpdate({
      ...recipe,
      ingredients: updatedIngredients
    });
  };

  // Handler for nutrition info updates
  const handleNutritionChange = (updatedNutrition: NutritionInfo) => {
    onUpdate({
      ...recipe,
      nutritionInfo: updatedNutrition
    });
  };

  // Handler for recipe scaling
  const handleRecipeScale = (scaledIngredients: Ingredient[]) => {
    onUpdate({
      ...recipe,
      ingredients: scaledIngredients
    });
  };

  // Handler for servings update
  const handleServingsUpdate = (newServings: number) => {
    onUpdate({
      ...recipe,
      servings: newServings
    });
  };

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg shadow ${className}`}>
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${
              activeTab === 'ingredients'
                ? 'border-jamie-orange text-jamie-orange'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Ingredients
          </button>
          <button
            onClick={() => setActiveTab('nutrition')}
            className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${
              activeTab === 'nutrition'
                ? 'border-jamie-orange text-jamie-orange'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Nutrition
          </button>
          <button
            onClick={() => setActiveTab('scaling')}
            className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${
              activeTab === 'scaling'
                ? 'border-jamie-orange text-jamie-orange'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Scaling Tools
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'ingredients' && (
          <StructuredIngredientEditor 
            ingredients={recipe.ingredients || []} 
            onChange={handleIngredientsChange} 
          />
        )}

        {activeTab === 'nutrition' && (
          <NutritionalData 
            nutritionInfo={recipe.nutritionInfo || {}} 
            onChange={handleNutritionChange} 
          />
        )}

        {activeTab === 'scaling' && (
          <RecipeScalingTools 
            initialServings={recipe.servings || 4} 
            ingredients={recipe.ingredients || []} 
            onScaleIngredients={handleRecipeScale}
            onUpdateServings={handleServingsUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default AdvancedRecipeEditor;
