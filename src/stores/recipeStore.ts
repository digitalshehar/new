import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Recipe } from '../data/recipes';

interface RecipeState {
  recipes: Record<string, Recipe>;
  ratings: Record<string, number>;
  totalRatings: Record<string, number>;
  
  // Actions
  addRating: (slug: string, rating: number) => void;
  updateRecipe: (slug: string, recipe: Partial<Recipe>) => void;
}

export const useRecipeStore = create<RecipeState>()(
  persist(
    (set, get) => ({
      recipes: {},
      ratings: {},
      totalRatings: {},

      addRating: (slug: string, rating: number) => {
        set((state) => {
          const currentRating = state.ratings[slug] || 0;
          const currentTotal = state.totalRatings[slug] || 0;
          const newTotal = currentTotal + 1;
          const newRating = ((currentRating * currentTotal) + rating) / newTotal;

          return {
            ratings: {
              ...state.ratings,
              [slug]: newRating,
            },
            totalRatings: {
              ...state.totalRatings,
              [slug]: newTotal,
            },
          };
        });
      },

      updateRecipe: (slug: string, recipeUpdates: Partial<Recipe>) => {
        set((state) => ({
          recipes: {
            ...state.recipes,
            [slug]: {
              ...state.recipes[slug],
              ...recipeUpdates,
            },
          },
        }));
      },
    }),
    {
      name: 'recipe-storage',
    }
  )
);
