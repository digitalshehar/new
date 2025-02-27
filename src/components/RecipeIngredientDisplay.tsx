import React from 'react';
import type { Ingredient } from './admin/StructuredIngredientEditor';

interface Props {
  ingredients: Ingredient[];
  className?: string;
}

const RecipeIngredientDisplay: React.FC<Props> = ({ ingredients, className = '' }) => {
  // Group ingredients by their groupId
  const groupedIngredients: Record<string, Ingredient[]> = {};
  
  // Separate headings from actual ingredients
  const headings: Record<string, string> = {};
  const ungroupedIngredients: Ingredient[] = [];
  
  // Process ingredients to organize them
  ingredients.forEach(ing => {
    if (ing.isHeading) {
      // This is a heading, store its ID and name
      headings[ing.id] = ing.name;
    } else if (ing.groupId) {
      // This is a grouped ingredient
      if (!groupedIngredients[ing.groupId]) {
        groupedIngredients[ing.groupId] = [];
      }
      groupedIngredients[ing.groupId].push(ing);
    } else {
      // This is an ungrouped ingredient
      ungroupedIngredients.push(ing);
    }
  });
  
  // Render ingredient item
  const renderIngredient = (ingredient: Ingredient) => (
    <li key={ingredient.id} className="py-1">
      <span className="font-medium">
        {ingredient.amount && <span>{ingredient.amount} </span>}
        {ingredient.unit && <span>{ingredient.unit} </span>}
      </span>
      <span>{ingredient.name}</span>
      {ingredient.notes && (
        <span className="text-gray-600 dark:text-gray-400 italic"> ({ingredient.notes})</span>
      )}
    </li>
  );

  return (
    <div className={className}>
      {/* Ungrouped ingredients */}
      {ungroupedIngredients.length > 0 && (
        <ul className="list-disc pl-5 space-y-1 mb-6">
          {ungroupedIngredients.map(renderIngredient)}
        </ul>
      )}
      
      {/* Grouped ingredients */}
      {Object.keys(groupedIngredients).map(groupId => (
        <div key={groupId} className="mb-6">
          <h3 className="text-lg font-medium mb-2">{headings[groupId]}</h3>
          <ul className="list-disc pl-5 space-y-1">
            {groupedIngredients[groupId].map(renderIngredient)}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default RecipeIngredientDisplay;
