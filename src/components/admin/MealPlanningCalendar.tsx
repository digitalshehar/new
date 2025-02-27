// Path: c:\files\astro\ffw\src\components\admin\MealPlanningCalendar.tsx

import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

interface Recipe {
  id: string;
  title: string;
  slug?: string;
  prepTime?: number;
  cookTime?: number;
  cuisine?: string;
  course?: string;
  description?: string;
  featuredImage?: string;
}

interface MealPlan {
  id: string;
  date: Date;
  recipes: {
    breakfast: Recipe[];
    lunch: Recipe[];
    dinner: Recipe[];
    snacks: Recipe[];
  };
  notes?: string;
}

interface Props {
  recipes: Recipe[];
  initialMealPlans?: MealPlan[];
  onSaveMealPlan?: (mealPlan: MealPlan) => void;
  onGenerateShoppingList?: (startDate: Date, endDate: Date) => void;
}

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

const MealPlanningCalendar: React.FC<Props> = ({ 
  recipes, 
  initialMealPlans = [], 
  onSaveMealPlan,
  onGenerateShoppingList 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mealPlans, setMealPlans] = useState<MealPlan[]>(initialMealPlans);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(recipes);
  const [activeSection, setActiveSection] = useState<MealType>('breakfast');
  const [draggedRecipe, setDraggedRecipe] = useState<Recipe | null>(null);
  const [mealPlanNotes, setMealPlanNotes] = useState('');

  // Calculate the start and end of the current week
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
  const endDate = endOfWeek(currentDate, { weekStartsOn: 1 }); // Sunday
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Filter recipes based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRecipes(recipes);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = recipes.filter(recipe => 
      recipe.title.toLowerCase().includes(query) ||
      recipe.description?.toLowerCase().includes(query) ||
      recipe.cuisine?.toLowerCase().includes(query) ||
      recipe.course?.toLowerCase().includes(query)
    );
    
    setFilteredRecipes(filtered);
  }, [searchQuery, recipes]);

  // Get meals for a specific day and meal type
  const getMeals = (date: Date, mealType: MealType): Recipe[] => {
    const mealPlan = mealPlans.find(mp => isSameDay(new Date(mp.date), date));
    if (!mealPlan) return [];
    return mealPlan.recipes[mealType];
  };

  // Get or create a meal plan for a specific day
  const getMealPlan = (date: Date): MealPlan => {
    const existingPlan = mealPlans.find(mp => isSameDay(new Date(mp.date), date));
    if (existingPlan) return existingPlan;
    
    return {
      id: `plan_${date.getTime()}`,
      date: date,
      recipes: {
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: []
      }
    };
  };

  // Handle adding a recipe to a specific day and meal type
  const addRecipeToMealPlan = (recipe: Recipe, date: Date, mealType: MealType) => {
    const updatedPlans = [...mealPlans];
    const planIndex = updatedPlans.findIndex(mp => isSameDay(new Date(mp.date), date));
    
    if (planIndex >= 0) {
      // Update existing meal plan
      updatedPlans[planIndex] = {
        ...updatedPlans[planIndex],
        recipes: {
          ...updatedPlans[planIndex].recipes,
          [mealType]: [...updatedPlans[planIndex].recipes[mealType], recipe]
        }
      };
    } else {
      // Create new meal plan
      const newPlan: MealPlan = {
        id: `plan_${date.getTime()}`,
        date: date,
        recipes: {
          breakfast: [],
          lunch: [],
          dinner: [],
          snacks: []
        },
        notes: ''
      };
      
      newPlan.recipes[mealType] = [recipe];
      updatedPlans.push(newPlan);
    }
    
    setMealPlans(updatedPlans);
    
    // Notify parent component
    const updatedPlan = updatedPlans.find(mp => isSameDay(new Date(mp.date), date));
    if (updatedPlan && onSaveMealPlan) {
      onSaveMealPlan(updatedPlan);
    }
  };

  // Handle removing a recipe from a meal plan
  const removeRecipeFromMealPlan = (recipeId: string, date: Date, mealType: MealType) => {
    const updatedPlans = [...mealPlans];
    const planIndex = updatedPlans.findIndex(mp => isSameDay(new Date(mp.date), date));
    
    if (planIndex >= 0) {
      updatedPlans[planIndex] = {
        ...updatedPlans[planIndex],
        recipes: {
          ...updatedPlans[planIndex].recipes,
          [mealType]: updatedPlans[planIndex].recipes[mealType].filter(
            recipe => recipe.id !== recipeId
          )
        }
      };
      
      setMealPlans(updatedPlans);
      
      // Notify parent component
      if (onSaveMealPlan) {
        onSaveMealPlan(updatedPlans[planIndex]);
      }
    }
  };

  // Save notes for a meal plan
  const saveMealPlanNotes = () => {
    if (!selectedDate) return;
    
    const updatedPlans = [...mealPlans];
    const planIndex = updatedPlans.findIndex(mp => isSameDay(new Date(mp.date), selectedDate));
    
    if (planIndex >= 0) {
      updatedPlans[planIndex] = {
        ...updatedPlans[planIndex],
        notes: mealPlanNotes
      };
    } else {
      // Create new meal plan
      const newPlan: MealPlan = {
        id: `plan_${selectedDate.getTime()}`,
        date: selectedDate,
        recipes: {
          breakfast: [],
          lunch: [],
          dinner: [],
          snacks: []
        },
        notes: mealPlanNotes
      };
      
      updatedPlans.push(newPlan);
    }
    
    setMealPlans(updatedPlans);
    
    // Notify parent component
    const updatedPlan = updatedPlans.find(mp => isSameDay(new Date(mp.date), selectedDate));
    if (updatedPlan && onSaveMealPlan) {
      onSaveMealPlan(updatedPlan);
    }
  };

  // Navigate to previous week
  const goToPreviousWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };

  // Navigate to next week
  const goToNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  // Handle day selection
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    const mealPlan = getMealPlan(date);
    setMealPlanNotes(mealPlan.notes || '');
  };

  // Generate shopping list
  const handleGenerateShoppingList = () => {
    if (onGenerateShoppingList) {
      onGenerateShoppingList(startDate, endDate);
    }
  };

  // Handle drag start for recipes
  const handleDragStart = (recipe: Recipe) => {
    setDraggedRecipe(recipe);
  };

  // Handle drop zone for calendar cells
  const handleDrop = (date: Date, mealType: MealType) => {
    if (draggedRecipe) {
      addRecipeToMealPlan(draggedRecipe, date, mealType);
      setDraggedRecipe(null);
    }
  };

  // Handle drag over to prevent default browser behavior
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
      {/* Calendar Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Meal Planning Calendar
        </h2>
        
        <div className="flex space-x-2">
          <button
            onClick={goToPreviousWeek}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <span className="text-gray-900 dark:text-white font-medium">
            {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
          </span>
          
          <button
            onClick={goToNextWeek}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <button
          onClick={handleGenerateShoppingList}
          className="px-3 py-2 bg-jamie-orange text-white rounded-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jamie-orange text-sm"
        >
          Generate Shopping List
        </button>
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
        {/* Day Headers */}
        {days.map(day => (
          <div 
            key={day.toISOString()} 
            className="p-2 text-center border-r border-gray-200 dark:border-gray-700 last:border-r-0"
          >
            <div className="font-medium text-gray-900 dark:text-white">
              {format(day, 'EEEE')}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {format(day, 'MMM d')}
            </div>
          </div>
        ))}
      </div>
      
      {/* Main Grid Content */}
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
        {/* Meal Type Labels */}
        <div className="col-span-7 grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
          <div className="col-span-1 p-2 border-r border-gray-200 dark:border-gray-700 flex items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Breakfast</span>
          </div>
          {days.map(day => (
            <div 
              key={`breakfast-${day.toISOString()}`}
              className="col-span-1 p-2 border-r border-gray-200 dark:border-gray-700 last:border-r-0 min-h-[100px]"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(day, 'breakfast')}
            >
              {getMeals(day, 'breakfast').map(recipe => (
                <div 
                  key={`breakfast-${day.toISOString()}-${recipe.id}`}
                  className="mb-1 p-1 bg-blue-100 dark:bg-blue-900 rounded text-sm text-blue-800 dark:text-blue-100 flex justify-between"
                >
                  <span className="truncate">{recipe.title}</span>
                  <button 
                    onClick={() => removeRecipeFromMealPlan(recipe.id, day, 'breakfast')}
                    className="text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
        
        {/* Lunch Row */}
        <div className="col-span-7 grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
          <div className="col-span-1 p-2 border-r border-gray-200 dark:border-gray-700 flex items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Lunch</span>
          </div>
          {days.map(day => (
            <div 
              key={`lunch-${day.toISOString()}`}
              className="col-span-1 p-2 border-r border-gray-200 dark:border-gray-700 last:border-r-0 min-h-[100px]"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(day, 'lunch')}
            >
              {getMeals(day, 'lunch').map(recipe => (
                <div 
                  key={`lunch-${day.toISOString()}-${recipe.id}`}
                  className="mb-1 p-1 bg-green-100 dark:bg-green-900 rounded text-sm text-green-800 dark:text-green-100 flex justify-between"
                >
                  <span className="truncate">{recipe.title}</span>
                  <button 
                    onClick={() => removeRecipeFromMealPlan(recipe.id, day, 'lunch')}
                    className="text-green-500 hover:text-green-700 dark:text-green-300 dark:hover:text-green-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
        
        {/* Dinner Row */}
        <div className="col-span-7 grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
          <div className="col-span-1 p-2 border-r border-gray-200 dark:border-gray-700 flex items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dinner</span>
          </div>
          {days.map(day => (
            <div 
              key={`dinner-${day.toISOString()}`}
              className="col-span-1 p-2 border-r border-gray-200 dark:border-gray-700 last:border-r-0 min-h-[100px]"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(day, 'dinner')}
            >
              {getMeals(day, 'dinner').map(recipe => (
                <div 
                  key={`dinner-${day.toISOString()}-${recipe.id}`}
                  className="mb-1 p-1 bg-purple-100 dark:bg-purple-900 rounded text-sm text-purple-800 dark:text-purple-100 flex justify-between"
                >
                  <span className="truncate">{recipe.title}</span>
                  <button 
                    onClick={() => removeRecipeFromMealPlan(recipe.id, day, 'dinner')}
                    className="text-purple-500 hover:text-purple-700 dark:text-purple-300 dark:hover:text-purple-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
        
        {/* Snacks Row */}
        <div className="col-span-7 grid grid-cols-7">
          <div className="col-span-1 p-2 border-r border-gray-200 dark:border-gray-700 flex items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Snacks</span>
          </div>
          {days.map(day => (
            <div 
              key={`snacks-${day.toISOString()}`}
              className="col-span-1 p-2 border-r border-gray-200 dark:border-gray-700 last:border-r-0 min-h-[100px]"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(day, 'snacks')}
            >
              {getMeals(day, 'snacks').map(recipe => (
                <div 
                  key={`snacks-${day.toISOString()}-${recipe.id}`}
                  className="mb-1 p-1 bg-yellow-100 dark:bg-yellow-900 rounded text-sm text-yellow-800 dark:text-yellow-100 flex justify-between"
                >
                  <span className="truncate">{recipe.title}</span>
                  <button 
                    onClick={() => removeRecipeFromMealPlan(recipe.id, day, 'snacks')}
                    className="text-yellow-500 hover:text-yellow-700 dark:text-yellow-300 dark:hover:text-yellow-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Day Details */}
      {selectedDate && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Day Notes
            </label>
            <textarea
              value={mealPlanNotes}
              onChange={(e) => setMealPlanNotes(e.target.value)}
              className="shadow-sm focus:ring-jamie-orange focus:border-jamie-orange block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              rows={3}
              placeholder="Add notes for this day's meals..."
            ></textarea>
            <div className="mt-2 flex justify-end">
              <button
                onClick={saveMealPlanNotes}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-jamie-orange hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jamie-orange"
              >
                Save Notes
              </button>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">
              Nutrition Summary for the Day
            </h4>
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-xl font-medium text-jamie-orange">0</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Total Calories</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-medium text-jamie-orange">0g</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Protein</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-medium text-jamie-orange">0g</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Carbs</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-medium text-jamie-orange">0g</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Fat</div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              * Nutritional values are estimates based on recipe data. Add complete nutritional information to recipes for accurate totals.
            </p>
          </div>
        </div>
      )}
      
      {/* Recipe Selection */}
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Add Recipes to Your Meal Plan
        </h3>
        
        <div className="flex mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipes..."
            className="shadow-sm focus:ring-jamie-orange focus:border-jamie-orange block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
          />
        </div>
        
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
          <button
            onClick={() => setActiveSection('breakfast')}
            className={`px-4 py-2 text-sm font-medium ${
              activeSection === 'breakfast'
                ? 'border-b-2 border-jamie-orange text-jamie-orange'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Breakfast
          </button>
          <button
            onClick={() => setActiveSection('lunch')}
            className={`px-4 py-2 text-sm font-medium ${
              activeSection === 'lunch'
                ? 'border-b-2 border-jamie-orange text-jamie-orange'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Lunch
          </button>
          <button
            onClick={() => setActiveSection('dinner')}
            className={`px-4 py-2 text-sm font-medium ${
              activeSection === 'dinner'
                ? 'border-b-2 border-jamie-orange text-jamie-orange'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Dinner
          </button>
          <button
            onClick={() => setActiveSection('snacks')}
            className={`px-4 py-2 text-sm font-medium ${
              activeSection === 'snacks'
                ? 'border-b-2 border-jamie-orange text-jamie-orange'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Snacks
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
          {filteredRecipes.map(recipe => (
            <div
              key={recipe.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-grab"
              draggable
              onDragStart={() => handleDragStart(recipe)}
            >
              <div className="p-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1 truncate">
                  {recipe.title}
                </h4>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{recipe.cuisine || 'General'}</span>
                  <span>
                    {recipe.prepTime && recipe.cookTime 
                      ? `${recipe.prepTime + recipe.cookTime} min` 
                      : 'Time N/A'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                  {recipe.description || 'No description available.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MealPlanningCalendar;
