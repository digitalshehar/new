import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DoctorProfile, NutritionalGuideline, PatientRecord, MealPlan } from '../types/doctor';

interface DoctorStore {
  // Authentication
  isAuthenticated: boolean;
  profile: DoctorProfile | null;
  
  // Data
  patients: PatientRecord[];
  guidelines: NutritionalGuideline[];
  mealPlans: MealPlan[];
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: Partial<DoctorProfile>) => void;
  
  // Patient Management
  addPatient: (patient: PatientRecord) => void;
  updatePatient: (patientId: string, updates: Partial<PatientRecord>) => void;
  removePatient: (patientId: string) => void;
  
  // Guidelines Management
  createGuideline: (guideline: NutritionalGuideline) => void;
  updateGuideline: (guidelineId: string, updates: Partial<NutritionalGuideline>) => void;
  removeGuideline: (guidelineId: string) => void;
  
  // Meal Plans Management
  createMealPlan: (mealPlan: MealPlan) => void;
  updateMealPlan: (mealPlanId: string, updates: Partial<MealPlan>) => void;
  removeMealPlan: (mealPlanId: string) => void;
}

// Mock doctor data for local development
const mockDoctor: DoctorProfile = {
  id: 'doc_1',
  name: 'Dr. Sarah Johnson',
  email: 'sarah.johnson@example.com',
  specialization: 'Nutritionist',
  qualifications: ['MD', 'Ph.D. in Clinical Nutrition'],
  bio: 'Specialized in dietary management and nutritional therapy with over 10 years of experience.',
  contactInfo: {
    phone: '+1-555-0123',
    clinic: 'Wellness Nutrition Clinic',
    address: '123 Health Street, Medical District'
  }
};

export const useDoctorStore = create<DoctorStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      profile: null,
      patients: [],
      guidelines: [],
      mealPlans: [],

      login: async (email: string, password: string) => {
        // In a real app, this would make an API call
        if (email === mockDoctor.email && password === 'password123') {
          set({ isAuthenticated: true, profile: mockDoctor });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ isAuthenticated: false, profile: null });
      },

      updateProfile: (updates) => {
        const currentProfile = get().profile;
        if (currentProfile) {
          set({ profile: { ...currentProfile, ...updates } });
        }
      },

      addPatient: (patient) => {
        set((state) => ({
          patients: [...state.patients, patient]
        }));
      },

      updatePatient: (patientId, updates) => {
        set((state) => ({
          patients: state.patients.map(p =>
            p.id === patientId ? { ...p, ...updates } : p
          )
        }));
      },

      removePatient: (patientId) => {
        set((state) => ({
          patients: state.patients.filter(p => p.id !== patientId)
        }));
      },

      createGuideline: (guideline) => {
        set((state) => ({
          guidelines: [...state.guidelines, guideline]
        }));
      },

      updateGuideline: (guidelineId, updates) => {
        set((state) => ({
          guidelines: state.guidelines.map(g =>
            g.id === guidelineId ? { ...g, ...updates } : g
          )
        }));
      },

      removeGuideline: (guidelineId) => {
        set((state) => ({
          guidelines: state.guidelines.filter(g => g.id !== guidelineId)
        }));
      },

      createMealPlan: (mealPlan) => {
        set((state) => ({
          mealPlans: [...state.mealPlans, mealPlan]
        }));
      },

      updateMealPlan: (mealPlanId, updates) => {
        set((state) => ({
          mealPlans: state.mealPlans.map(m =>
            m.id === mealPlanId ? { ...m, ...updates } : m
          )
        }));
      },

      removeMealPlan: (mealPlanId) => {
        set((state) => ({
          mealPlans: state.mealPlans.filter(m => m.id !== mealPlanId)
        }));
      },
    }),
    {
      name: 'doctor-storage',
    }
  )
);
