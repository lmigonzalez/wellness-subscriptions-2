export interface Exercise {
  name: string;
  description: string;
  duration: string;
  sets?: string;
  reps?: string;
}

export interface Meal {
  name: string;
  description: string;
  calories: number;
  ingredients: string[];
  instructions: string[];
}

export interface DailyPlan {
  date: string; // YYYY-MM-DD format
  quote: {
    text: string;
    author: string;
  };
  workout: Exercise[];
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
  };
}

// Note: This file now only contains type definitions.
// All data operations are handled by lib/storage.ts which uses Prisma with SQLite.
