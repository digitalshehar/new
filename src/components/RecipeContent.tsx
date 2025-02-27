import { motion } from 'framer-motion';
import type { Recipe } from '../data/recipes';
import CookingSteps from './CookingSteps';
import IngredientsList from './IngredientsList';

interface RecipeContentProps {
  recipe: Recipe;
  children?: React.ReactNode;
}

export default function RecipeContent({ recipe, children }: RecipeContentProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="lg:col-span-2 space-y-8"
      >
        <section id="method">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100"
          >
            Method
          </motion.h2>
          <div className="space-y-8">
            <CookingSteps steps={recipe.method} />
          </div>
          {children} {/* This is where the timer will be rendered */}
        </section>

        {recipe.tips && recipe.tips.length > 0 && (
          <section id="tips">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100"
            >
              Chef's Tips
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl p-6"
            >
              <div className="grid gap-4">
                {recipe.tips.map((tip, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                    className="flex items-start gap-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200">{tip}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {recipe.variations && recipe.variations.length > 0 && (
          <section id="variations">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100"
            >
              Recipe Variations
            </motion.h2>
            <div className="space-y-6">
              {recipe.variations.map((variation, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                >
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    {variation.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {variation.description}
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    {variation.changes.map((change, j) => (
                      <li key={j}>{change}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="lg:col-span-1"
      >
        <div className="sticky top-8 space-y-8">
          <section id="ingredients">
            <IngredientsList ingredients={recipe.ingredients} servings={recipe.serves} />
          </section>

          <section id="nutrition">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Nutrition Information</h3>
              {recipe.nutritionInfo && (
                <div className="space-y-3">
                  {Object.entries(recipe.nutritionInfo).map(([key, value], i) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 + 0.5 }}
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-700 rounded-lg"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                        <NutritionIcon type={key} />
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">{key}</span>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{value}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </section>

          <section id="timer">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Recipe Timer</h3>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Cooking Time</span>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{recipe.cookingTime}</p>
                </div>
              </div>
            </motion.div>
          </section>

          <section id="toc">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Table of Contents</h3>
              <ul className="list-none space-y-2 text-gray-700 dark:text-gray-300">
                <li>
                  <a href="#method" className="text-gray-900 dark:text-gray-100 hover:text-amber-500 dark:hover:text-amber-500">
                    Method
                  </a>
                </li>
                {recipe.tips && recipe.tips.length > 0 && (
                  <li>
                    <a href="#tips" className="text-gray-900 dark:text-gray-100 hover:text-amber-500 dark:hover:text-amber-500">
                      Chef's Tips
                    </a>
                  </li>
                )}
                {recipe.variations && recipe.variations.length > 0 && (
                  <li>
                    <a href="#variations" className="text-gray-900 dark:text-gray-100 hover:text-amber-500 dark:hover:text-amber-500">
                      Recipe Variations
                    </a>
                  </li>
                )}
                <li>
                  <a href="#ingredients" className="text-gray-900 dark:text-gray-100 hover:text-amber-500 dark:hover:text-amber-500">
                    Ingredients
                  </a>
                </li>
                <li>
                  <a href="#nutrition" className="text-gray-900 dark:text-gray-100 hover:text-amber-500 dark:hover:text-amber-500">
                    Nutrition Information
                  </a>
                </li>
                <li>
                  <a href="#timer" className="text-gray-900 dark:text-gray-100 hover:text-amber-500 dark:hover:text-amber-500">
                    Recipe Timer
                  </a>
                </li>
              </ul>
            </motion.div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}

function NutritionIcon({ type }: { type: string }) {
  switch (type.toLowerCase()) {
    case 'calories':
      return (
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    case 'protein':
      return (
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    case 'carbs':
    case 'carbohydrates':
      return (
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
        </svg>
      );
    case 'fat':
      return (
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
  }
}
