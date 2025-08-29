import { DailyPlan } from "./data";
import { supabase, planToDB, dbToPlan } from "./supabase";

// Get plan by date from database
export async function getPlanByDate(date: string): Promise<DailyPlan | null> {
  try {
    const { data, error } = await supabase
      .from('daily_plans')
      .select('*')
      .eq('date', date)
      .single();

    if (error || !data) {
      console.log(`No plan found in database for ${date}`);
      return null;
    }

    return dbToPlan(data);
  } catch (error) {
    console.error(`Error fetching plan for ${date}:`, error);
    return null;
  }
}

// Get today's plan from database
export async function getTodaysPlan(): Promise<DailyPlan | null> {
  const today = new Date().toISOString().split("T")[0];
  
  // Always try to get from database first
  let plan = await getPlanByDate(today);
  
  if (!plan) {
    console.log(`No plan found in database for ${today}, generating fresh content...`);
    const { generateDailyPlan } = await import('./openai');
    plan = await generateDailyPlan(today);
    await savePlan(plan);
    console.log(`Generated and saved new plan for ${today}`);
  } else {
    console.log(`Found existing plan in database for ${today}`);
  }
  
  return plan;
}

// Save plan to database
export async function savePlan(plan: DailyPlan): Promise<void> {
  try {
    const planData = planToDB(plan);
    
    const { error } = await supabase
      .from('daily_plans')
      .upsert(planData, { 
        onConflict: 'date',
        ignoreDuplicates: false 
      });

    if (error) {
      console.error('Error saving plan to database:', error);
      throw error;
    }

    console.log(`Plan saved to database for ${plan.date}`);
  } catch (error) {
    console.error('Error in savePlan:', error);
    throw error;
  }
}

// Check if plan exists for date
export async function planExists(date: string): Promise<boolean> {
  const plan = await getPlanByDate(date);
  return plan !== null;
}

// Clean up old plans (keep only last 30 days)
export async function cleanupOldPlans(): Promise<void> {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoffDate = thirtyDaysAgo.toISOString().split("T")[0];
    
    const { error } = await supabase
      .from('daily_plans')
      .delete()
      .lt('date', cutoffDate);

    if (error) {
      console.error('Error cleaning up old plans:', error);
    } else {
      console.log(`Cleaned up old plans before ${cutoffDate}`);
    }
  } catch (error) {
    console.error('Error in cleanupOldPlans:', error);
  }
}

// Get all plans (for admin purposes)
export async function getAllPlans(): Promise<DailyPlan[]> {
  try {
    const { data, error } = await supabase
      .from('daily_plans')
      .select('*')
      .order('date', { ascending: false });

    if (error || !data) {
      console.error('Error fetching all plans:', error);
      return [];
    }

    return data.map(dbToPlan);
  } catch (error) {
    console.error('Error in getAllPlans:', error);
    return [];
  }
}
