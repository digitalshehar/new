export interface DoctorProfile {
  id: string;
  name: string;
  email: string;
  specialization: string;
  qualifications: string[];
  bio: string;
  avatar?: string;
  contactInfo: {
    phone?: string;
    address?: string;
    clinic?: string;
  };
}

export interface NutritionalGuideline {
  id: string;
  title: string;
  description: string;
  targetConditions: string[];
  recommendations: string[];
  restrictions: string[];
  mealPlan?: MealPlan;
  createdBy: string; // Doctor ID
  createdAt: string;
  updatedAt: string;
}

export interface MealPlan {
  id: string;
  name: string;
  description: string;
  duration: number; // in days
  meals: DailyMeal[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  createdBy: string; // Doctor ID
}

export interface DailyMeal {
  day: number;
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  snacks: string[];
}

export interface PatientRecord {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  conditions: string[];
  allergies: string[];
  currentMedications: string[];
  assignedGuidelines: string[]; // IDs of NutritionalGuideline
  assignedMealPlans: string[]; // IDs of MealPlan
  notes: PatientNote[];
  doctorId: string;
}

export interface PatientNote {
  id: string;
  content: string;
  date: string;
  doctorId: string;
  type: 'dietary' | 'medical' | 'progress' | 'general';
}
