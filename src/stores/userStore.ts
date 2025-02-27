import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  UserProfile,
  Collection,
  MealPlan,
  ShoppingList,
  CookingSession,
  UserActivity,
  Achievement,
  Note
} from '../types/user';

interface UserState {
  // Authentication
  isAuthenticated: boolean;
  profile: UserProfile | null;
  
  // Core Data
  collections: Collection[];
  mealPlans: MealPlan[];
  cookingSessions: CookingSession[];
  activities: UserActivity[];
  shoppingLists: ShoppingList[];
  userRatings: Record<string, number>;
  favoriteRecipes: string[];
  notes: Note[];
  
  // Authentication Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, username: string) => Promise<boolean>;
  
  // Profile Management
  updateProfile: (updates: Partial<UserProfile>) => void;
  updatePreferences: (updates: Partial<UserProfile['preferences']>) => void;
  updateSocialLinks: (updates: Partial<UserProfile['socialLinks']>) => void;
  
  // Collection Management
  createCollection: (collection: Collection) => void;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  addRecipeToCollection: (collectionId: string, recipeId: string) => void;
  removeRecipeFromCollection: (collectionId: string, recipeId: string) => void;
  
  // Recipe Interactions
  addRating: (recipeSlug: string, rating: number) => Promise<void>;
  addFavorite: (recipeSlug: string) => void;
  removeFavorite: (recipeSlug: string) => void;
  addNote: (note: Note) => void;
  removeNote: (recipeSlug: string) => void;
  updateNote: (recipeSlug: string, text: string) => void;
  
  // Meal Planning
  createMealPlan: (mealPlan: MealPlan) => void;
  updateMealPlan: (id: string, updates: Partial<MealPlan>) => void;
  deleteMealPlan: (id: string) => void;
  generateShoppingList: (mealPlanId: string) => ShoppingList;
  
  // Cooking Tracking
  startCookingSession: (recipeId: string) => CookingSession;
  updateCookingSession: (id: string, updates: Partial<CookingSession>) => void;
  endCookingSession: (id: string, rating: number) => void;
  
  // Activity Tracking
  addActivity: (activity: UserActivity) => void;
  updateStreak: () => void;
  checkAchievements: () => void;
}

// Mock user data for development
const mockUser: UserProfile = {
  id: 'user_1',
  username: 'foodie_123',
  displayName: 'Foodie Enthusiast',
  email: 'foodie@example.com',
  bio: 'Passionate about cooking and trying new recipes!',
  avatar: '/images/avatars/default.png',
  preferences: {
    dietaryRestrictions: [],
    cuisinePreferences: ['Italian', 'Japanese', 'Mexican'],
    skillLevel: 'intermediate',
    servingSize: 4,
    measurementSystem: 'metric',
    darkMode: false,
  },
  socialLinks: {
    instagram: '',
    twitter: '',
    facebook: '',
  },
  stats: {
    recipesCreated: 0,
    recipesCooked: 0,
    totalLikes: 0,
    followers: 0,
    following: 0,
  },
  achievements: [],
  currentStreak: 0,
  longestStreak: 0,
  lastCookingSession: null,
};

export const userStore = create(
  persist<UserState>(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      profile: null,
      collections: [],
      mealPlans: [],
      cookingSessions: [],
      activities: [],
      shoppingLists: [],
      userRatings: {},
      favoriteRecipes: [],
      notes: [],

      // Authentication Actions
      login: async (email: string, password: string) => {
        // Mock login for development
        if (email === 'foodie@example.com' && password === 'password123') {
          set({ isAuthenticated: true, profile: mockUser });
          return true;
        }
        return false;
      },

      logout: () => {
        set({
          isAuthenticated: false,
          profile: null,
          collections: [],
          mealPlans: [],
          cookingSessions: [],
          activities: [],
          shoppingLists: [],
          userRatings: {},
          favoriteRecipes: [],
          notes: [],
        });
      },

      register: async (email: string, password: string, username: string) => {
        const newUser = {
          ...mockUser,
          email,
          username,
        };
        set({ isAuthenticated: true, profile: newUser });
        return true;
      },

      // Profile Management
      updateProfile: (updates: Partial<UserProfile>) => {
        const currentProfile = get().profile;
        if (currentProfile) {
          set({
            profile: {
              ...currentProfile,
              ...updates,
            },
          });
        }
      },

      updatePreferences: (updates: Partial<UserProfile['preferences']>) => {
        const currentProfile = get().profile;
        if (currentProfile) {
          set({
            profile: {
              ...currentProfile,
              preferences: {
                ...currentProfile.preferences,
                ...updates,
              },
            },
          });
        }
      },

      updateSocialLinks: (updates: Partial<UserProfile['socialLinks']>) => {
        const currentProfile = get().profile;
        if (currentProfile) {
          set({
            profile: {
              ...currentProfile,
              socialLinks: {
                ...currentProfile.socialLinks,
                ...updates,
              },
            },
          });
        }
      },

      // Collection Management
      createCollection: (collection: Collection) => {
        set((state) => ({
          collections: [...state.collections, collection],
        }));
      },

      updateCollection: (id: string, updates: Partial<Collection>) => {
        set((state) => ({
          collections: state.collections.map((collection) =>
            collection.id === id ? { ...collection, ...updates } : collection
          ),
        }));
      },

      deleteCollection: (id: string) => {
        set((state) => ({
          collections: state.collections.filter((collection) => collection.id !== id),
        }));
      },

      addRecipeToCollection: (collectionId: string, recipeId: string) => {
        set((state) => ({
          collections: state.collections.map((collection) =>
            collection.id === collectionId && !collection.recipes.includes(recipeId)
              ? {
                  ...collection,
                  recipes: [...collection.recipes, recipeId],
                  updatedAt: new Date().toISOString(),
                }
              : collection
          ),
        }));
      },

      removeRecipeFromCollection: (collectionId: string, recipeId: string) => {
        set((state) => ({
          collections: state.collections.map((collection) =>
            collection.id === collectionId
              ? {
                  ...collection,
                  recipes: collection.recipes.filter((id) => id !== recipeId),
                  updatedAt: new Date().toISOString(),
                }
              : collection
          ),
        }));
      },

      // Recipe Interactions
      addRating: async (recipeSlug: string, rating: number) => {
        if (!recipeSlug || rating < 1 || rating > 5) {
          throw new Error('Invalid rating parameters');
        }

        const currentState = get();
        const previousRating = currentState.userRatings[recipeSlug] || 0;

        try {
          // Optimistically update the UI
          set((state) => ({
            userRatings: {
              ...state.userRatings,
              [recipeSlug]: rating,
            },
          }));

          // TODO: Add API call here when backend is ready
          // const response = await api.submitRating(recipeSlug, rating);
          
          const activity: UserActivity = {
            id: `activity_${Date.now()}`,
            type: 'rating',
            recipeId: recipeSlug,
            timestamp: new Date().toISOString(),
            details: { rating },
          };
          
          get().addActivity(activity);
          get().checkAchievements();
        } catch (error) {
          // Rollback on error
          set((state) => ({
            userRatings: {
              ...state.userRatings,
              [recipeSlug]: previousRating,
            },
          }));
          throw error;
        }
      },

      addFavorite: (recipeSlug: string) => {
        set((state) => ({
          favoriteRecipes: [...state.favoriteRecipes, recipeSlug],
        }));

        const activity: UserActivity = {
          id: `activity_${Date.now()}`,
          type: 'favorite',
          recipeId: recipeSlug,
          timestamp: new Date().toISOString(),
          details: {},
        };
        get().addActivity(activity);
      },

      removeFavorite: (recipeSlug: string) => {
        set((state) => ({
          favoriteRecipes: state.favoriteRecipes.filter((id) => id !== recipeSlug),
        }));
      },

      addNote: (note: Note) => {
        set((state) => ({
          notes: [...state.notes, { ...note, createdAt: new Date().toISOString() }],
        }));

        const activity: UserActivity = {
          id: `activity_${Date.now()}`,
          type: 'note',
          recipeId: note.recipeSlug,
          timestamp: new Date().toISOString(),
          details: { noteId: note.id },
        };
        get().addActivity(activity);
      },

      removeNote: (recipeSlug: string) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.recipeSlug !== recipeSlug),
        }));
      },

      updateNote: (recipeSlug: string, text: string) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.recipeSlug === recipeSlug
              ? { ...note, text, updatedAt: new Date().toISOString() }
              : note
          ),
        }));
      },

      // Meal Planning
      createMealPlan: (mealPlan: MealPlan) => {
        set((state) => ({
          mealPlans: [...state.mealPlans, mealPlan],
        }));
      },

      updateMealPlan: (id: string, updates: Partial<MealPlan>) => {
        set((state) => ({
          mealPlans: state.mealPlans.map((plan) =>
            plan.id === id ? { ...plan, ...updates } : plan
          ),
        }));
      },

      deleteMealPlan: (id: string) => {
        set((state) => ({
          mealPlans: state.mealPlans.filter((plan) => plan.id !== id),
        }));
      },

      generateShoppingList: (mealPlanId: string) => {
        const shoppingList: ShoppingList = {
          id: `list_${Date.now()}`,
          mealPlanId,
          items: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          shoppingLists: [...state.shoppingLists, shoppingList],
        }));
        return shoppingList;
      },

      // Cooking Tracking
      startCookingSession: (recipeId: string) => {
        const session: CookingSession = {
          id: `session_${Date.now()}`,
          recipeId,
          startTime: new Date().toISOString(),
          endTime: null,
          completed: false,
          rating: null,
          notes: '',
        };
        set((state) => ({
          cookingSessions: [...state.cookingSessions, session],
        }));
        return session;
      },

      updateCookingSession: (id: string, updates: Partial<CookingSession>) => {
        set((state) => ({
          cookingSessions: state.cookingSessions.map((session) =>
            session.id === id ? { ...session, ...updates } : session
          ),
        }));
      },

      endCookingSession: (id: string, rating: number) => {
        const session = get().cookingSessions.find((s) => s.id === id);
        if (session) {
          get().updateCookingSession(id, {
            endTime: new Date().toISOString(),
            completed: true,
            rating,
          });

          const activity: UserActivity = {
            id: `activity_${Date.now()}`,
            type: 'cooking',
            recipeId: session.recipeId,
            timestamp: new Date().toISOString(),
            details: { sessionId: id, rating },
          };
          get().addActivity(activity);
          get().updateStreak();
          get().checkAchievements();
        }
      },

      // Activity Tracking
      addActivity: (activity: UserActivity) => {
        set((state) => ({
          activities: [...state.activities, activity],
        }));
      },

      updateStreak: () => {
        const state = get();
        const today = new Date();
        const lastSession = state.profile?.lastCookingSession
          ? new Date(state.profile.lastCookingSession)
          : null;

        let newStreak = state.profile?.currentStreak || 0;
        
        if (lastSession) {
          const daysSinceLastSession = Math.floor(
            (today.getTime() - lastSession.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (daysSinceLastSession === 0) {
            // Already cooked today, keep streak
            return;
          } else if (daysSinceLastSession === 1) {
            // Cooked yesterday, increment streak
            newStreak++;
          } else {
            // Broke the streak
            newStreak = 1;
          }
        } else {
          // First cooking session
          newStreak = 1;
        }

        const longestStreak = Math.max(
          newStreak,
          state.profile?.longestStreak || 0
        );

        if (state.profile) {
          state.updateProfile({
            currentStreak: newStreak,
            longestStreak,
            lastCookingSession: today.toISOString(),
          });
        }
      },

      checkAchievements: () => {
        const state = get();
        if (!state.profile) return;

        const newAchievements: Achievement[] = [];

        // Check cooking streak achievements
        if (state.profile.currentStreak >= 7) {
          newAchievements.push({
            id: 'weekly_chef',
            name: 'Weekly Chef',
            description: 'Cook recipes 7 days in a row',
            unlockedAt: new Date().toISOString(),
          });
        }

        if (state.profile.currentStreak >= 30) {
          newAchievements.push({
            id: 'master_chef',
            name: 'Master Chef',
            description: 'Cook recipes 30 days in a row',
            unlockedAt: new Date().toISOString(),
          });
        }

        // Check recipes cooked achievement
        if (state.cookingSessions.length >= 10) {
          newAchievements.push({
            id: 'cooking_enthusiast',
            name: 'Cooking Enthusiast',
            description: 'Cook 10 different recipes',
            unlockedAt: new Date().toISOString(),
          });
        }

        // Check rating achievement
        if (Object.keys(state.userRatings).length >= 5) {
          newAchievements.push({
            id: 'food_critic',
            name: 'Food Critic',
            description: 'Rate 5 different recipes',
            unlockedAt: new Date().toISOString(),
          });
        }

        // Check favorite recipes achievement
        if (state.favoriteRecipes.length >= 10) {
          newAchievements.push({
            id: 'recipe_collector',
            name: 'Recipe Collector',
            description: 'Save 10 recipes to favorites',
            unlockedAt: new Date().toISOString(),
          });
        }

        // Add new achievements
        if (newAchievements.length > 0) {
          state.updateProfile({
            achievements: [
              ...state.profile.achievements,
              ...newAchievements.filter(
                (achievement) =>
                  !state.profile?.achievements.some((a) => a.id === achievement.id)
              ),
            ],
          });
        }
      },
    }),
    {
      name: 'user-storage',
      skipHydration: typeof window === 'undefined',
      storage: typeof window !== 'undefined' 
        ? window.localStorage 
        : {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {}
          }
    }
  )
);
