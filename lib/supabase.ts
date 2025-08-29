import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table types
export interface DailyPlanDB {
  id?: number;
  date: string;
  quote_text: string;
  quote_author: string;
  workout: any;
  meals: any;
  created_at?: string;
  updated_at?: string;
}

// Helper function to convert DailyPlan to DB format
export function planToDB(plan: any): DailyPlanDB {
  return {
    date: plan.date,
    quote_text: plan.quote.text,
    quote_author: plan.quote.author,
    workout: plan.workout,
    meals: plan.meals
  };
}

// Helper function to convert DB format to DailyPlan
export function dbToPlan(dbPlan: DailyPlanDB): any {
  return {
    date: dbPlan.date,
    quote: {
      text: dbPlan.quote_text,
      author: dbPlan.quote_author
    },
    workout: dbPlan.workout,
    meals: dbPlan.meals
  };
}
