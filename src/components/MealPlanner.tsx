import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { userStore } from '../stores/userStore';
import type { Recipe } from '../types/recipe';

interface MealPlanDay {
  date: string;
  breakfast: string | null;
  lunch: string | null;
  dinner: string | null;
  snacks: string[];
}

interface DragItem {
  type: 'recipe';
  recipeId: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export default function MealPlanner({ recipes }: { recipes: Recipe[] }) {
  const user = userStore.get();
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const [mealPlan, setMealPlan] = useState<MealPlanDay[]>(generateEmptyWeek(currentWeek));
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);

  function generateEmptyWeek(startDate: Date): MealPlanDay[] {
    const week: MealPlanDay[] = [];
    const start = new Date(startDate);
    start.setDate(start.getDate() - start.getDay()); // Start from Sunday

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      week.push({
        date: date.toISOString().split('T')[0],
        breakfast: null,
        lunch: null,
        dinner: null,
        snacks: [],
      });
    }
    return week;
  }

  function handleDragStart(recipe: Recipe, mealType: DragItem['mealType']) {
    setDraggedItem({ type: 'recipe', recipeId: recipe.slug, mealType });
  }

  function handleDrop(dayIndex: number, mealType: DragItem['mealType']) {
    if (!draggedItem) return;

    setMealPlan((prev) => {
      const newPlan = [...prev];
      if (mealType === 'snack') {
        newPlan[dayIndex].snacks.push(draggedItem.recipeId);
      } else {
        newPlan[dayIndex][mealType] = draggedItem.recipeId;
      }
      return newPlan;
    });
  }

  function handlePreviousWeek() {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeek(newDate);
    setMealPlan(generateEmptyWeek(newDate));
  }

  function handleNextWeek() {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeek(newDate);
    setMealPlan(generateEmptyWeek(newDate));
  }

  function getRecipeById(id: string): Recipe | undefined {
    return recipes.find(recipe => recipe.slug === id);
  }

  const generateShoppingList = () => {
    const ingredients = new Set<string>();
    mealPlan.forEach(day => {
      [day.breakfast, day.lunch, day.dinner].forEach(mealId => {
        if (mealId) {
          const recipe = getRecipeById(mealId);
          recipe?.ingredients.forEach(ingredient => ingredients.add(ingredient));
        }
      });
      day.snacks.forEach(snackId => {
        const recipe = getRecipeById(snackId);
        recipe?.ingredients.forEach(ingredient => ingredients.add(ingredient));
      });
    });
    return Array.from(ingredients);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Meal Planner
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handlePreviousWeek}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-lg font-medium">
              {new Date(mealPlan[0].date).toLocaleDateString()} - {new Date(mealPlan[6].date).toLocaleDateString()}
            </span>
            <button
              onClick={handleNextWeek}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-8 gap-4">
          <div className="sticky top-24 col-span-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-h-[calc(100vh-8rem)] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Recipe Library</h2>
            <div className="space-y-2">
              {recipes.map(recipe => (
                <motion.div
                  key={recipe.slug}
                  draggable
                  onDragStart={() => handleDragStart(recipe, 'breakfast')}
                  className="p-2 bg-gray-50 dark:bg-gray-700 rounded cursor-move hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <h3 className="font-medium">{recipe.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {recipe.timeCategory}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="col-span-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="grid grid-cols-7 gap-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                <div key={day} className="text-center font-medium">
                  {day}
                </div>
              ))}

              {mealPlan.map((day, dayIndex) => (
                <div
                  key={day.date}
                  className="border dark:border-gray-700 rounded-lg p-2 space-y-2"
                >
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(day.date).getDate()}
                  </div>
                  
                  {(['breakfast', 'lunch', 'dinner'] as const).map(mealType => (
                    <div
                      key={mealType}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(dayIndex, mealType)}
                      className="min-h-[60px] p-2 bg-gray-50 dark:bg-gray-700 rounded"
                    >
                      <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {mealType}
                      </div>
                      {day[mealType] && (
                        <div className="text-sm font-medium">
                          {getRecipeById(day[mealType]!)?.title}
                        </div>
                      )}
                    </div>
                  ))}

                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(dayIndex, 'snack')}
                    className="min-h-[40px] p-2 bg-gray-50 dark:bg-gray-700 rounded"
                  >
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Snacks
                    </div>
                    {day.snacks.map(snackId => (
                      <div key={snackId} className="text-sm font-medium">
                        {getRecipeById(snackId)?.title}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={() => {
              const ingredients = generateShoppingList();
              // TODO: Save shopping list to user's account
              console.log('Shopping List:', ingredients);
            }}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-200"
          >
            Generate Shopping List
          </button>
        </div>
      </motion.div>
    </div>
  );
}
