export type DietaryPreference = 'vegetarian' | 'vegan' | 'gluten-free' | 'pescatarian' | 'none';
export type TimeCategory = 'quick' | 'medium' | 'long';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Season = 'Spring' | 'Summer' | 'Fall' | 'Winter' | 'All';

export interface NutritionInfo {
  calories: string;
  protein: string;
  carbohydrates: string;
  fat: string;
}

export interface Review {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  timeCategory: TimeCategory;
  difficulty: Difficulty;
  dietaryPreferences: DietaryPreference[];
  rating: number;
  seasonality: string[];
  ingredients: string[];
  method: string[];
  imageUrl: string;
  slug?: string;
  image?: string;
  prepTime?: string;
  cookingTime?: string;
  serves?: number;
  tips?: string[];
  nutritionInfo?: NutritionInfo;
  season?: Season;
  reviews?: Review[];
}
