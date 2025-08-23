import { promises as fs } from 'fs';
import path from 'path';
import { Exercise, Meal } from './data';

const DATA_DIR = path.join(process.cwd(), 'data');
const MONTHLY_PLANS_FILE = path.join(DATA_DIR, 'monthly-plans.json');

export interface MonthlyPlan {
  workout: Exercise[];
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
  };
}

interface MonthlyPlansStorage {
  [monthKey: string]: MonthlyPlan; // monthKey format: "YYYY-MM"
}

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Directory already exists
  }
}

// Load all monthly plans from JSON file
export async function loadMonthlyPlans(): Promise<MonthlyPlansStorage> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(MONTHLY_PLANS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    // File doesn't exist or is invalid, return empty object
    return {};
  }
}

// Save all monthly plans to JSON file
export async function saveMonthlyPlans(plans: MonthlyPlansStorage): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(MONTHLY_PLANS_FILE, JSON.stringify(plans, null, 2));
}

// Get monthly plan by month key (YYYY-MM)
export async function loadMonthlyPlan(monthKey: string): Promise<MonthlyPlan | null> {
  const plans = await loadMonthlyPlans();
  return plans[monthKey] || null;
}

// Save a monthly plan for a specific month
export async function saveMonthlyPlan(monthKey: string, plan: MonthlyPlan): Promise<void> {
  const plans = await loadMonthlyPlans();
  plans[monthKey] = plan;
  await saveMonthlyPlans(plans);
}

// Check if monthly plan exists for a specific month
export async function monthlyPlanExists(monthKey: string): Promise<boolean> {
  const plan = await loadMonthlyPlan(monthKey);
  return plan !== null;
}

// Clean up old monthly plans (older than 6 months)
export async function cleanupOldMonthlyPlans(): Promise<void> {
  try {
    const plans = await loadMonthlyPlans();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const cutoffMonth = sixMonthsAgo.toISOString().slice(0, 7); // YYYY-MM format
    
    const updatedPlans: MonthlyPlansStorage = {};
    
    for (const [monthKey, plan] of Object.entries(plans)) {
      if (monthKey >= cutoffMonth) {
        updatedPlans[monthKey] = plan;
      }
    }
    
    await saveMonthlyPlans(updatedPlans);
    console.log('Cleaned up old monthly plans');
  } catch (error) {
    console.error('Error cleaning up old monthly plans:', error);
  }
}
