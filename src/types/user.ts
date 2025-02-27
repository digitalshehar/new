export interface UserProfile {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio: string;
  avatar: string;
  preferences: UserPreferences;
  socialLinks: SocialLinks;
  stats: UserStats;
  achievements: Achievement[];
  currentStreak: number;
  longestStreak: number;
  lastCookingSession: string | null;
}

export interface UserPreferences {
  dietaryRestrictions: string[];
  cuisinePreferences: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  servingSize: number;
  measurementSystem: 'metric' | 'imperial';
  darkMode: boolean;
}

export interface SocialLinks {
  instagram: string;
  twitter: string;
  facebook: string;
}

export interface UserStats {
  recipesCreated: number;
  recipesCooked: number;
  totalLikes: number;
  followers: number;
  following: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  recipes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MealPlan {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  recipes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingList {
  id: string;
  mealPlanId: string;
  items: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CookingSession {
  id: string;
  recipeId: string;
  startTime: string;
  endTime: string | null;
  completed: boolean;
  rating: number | null;
  notes: string;
}

export interface UserActivity {
  id: string;
  type: 'rating' | 'favorite' | 'note' | 'cooking' | 'collection';
  recipeId: string;
  timestamp: string;
  details: Record<string, any>;
}

export interface Note {
  id: string;
  recipeSlug: string;
  text: string;
  createdAt: string;
  updatedAt?: string;
}
