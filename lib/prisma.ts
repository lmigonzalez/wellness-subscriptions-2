import { PrismaClient } from '@prisma/client';
import { DailyPlan, Exercise, Meal } from './data';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/nextjs-best-practices

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Database table types
export interface DailyPlanDB {
  id?: number;
  date: string;
  quoteText: string;
  quoteAuthor: string;
  workout: Exercise[];
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// Helper function to convert DailyPlan to DB format
export function planToDB(plan: DailyPlan): Omit<DailyPlanDB, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    date: plan.date,
    quoteText: plan.quote.text,
    quoteAuthor: plan.quote.author,
    workout: plan.workout,
    meals: plan.meals
  };
}

// Helper function to convert DB format to DailyPlan
export function dbToPlan(dbPlan: DailyPlanDB): DailyPlan {
  return {
    date: dbPlan.date,
    quote: {
      text: dbPlan.quoteText,
      author: dbPlan.quoteAuthor
    },
    workout: dbPlan.workout,
    meals: dbPlan.meals
  };
}

