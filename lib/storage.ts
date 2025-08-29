import { promises as fs } from "fs";
import path from "path";
import { DailyPlan } from "./data";

const DATA_DIR = path.join(process.cwd(), "data");
const PLANS_FILE = path.join(DATA_DIR, "daily-plans.json");

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Directory already exists
  }
}

// Load all plans from JSON file
export async function loadPlans(): Promise<DailyPlan[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(PLANS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    // File doesn't exist or is invalid, return empty array
    return [];
  }
}

// Save all plans to JSON file
export async function savePlans(plans: DailyPlan[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(PLANS_FILE, JSON.stringify(plans, null, 2));
}

// Get plan by date
export async function getPlanByDate(date: string): Promise<DailyPlan | null> {
  const plans = await loadPlans();
  return plans.find((plan) => plan.date === date) || null;
}

// Get today's plan
export async function getTodaysPlan(): Promise<DailyPlan | null> {
  const today = new Date().toISOString().split("T")[0];
  
  // In production (Vercel), we can't write to filesystem
  // So we'll always generate fresh content
  if (process.env.NODE_ENV === 'production') {
    const { generateDailyPlan } = await import('./openai');
    return await generateDailyPlan(today);
  }
  
  // In development, check if today's plan exists
  let plan = await getPlanByDate(today);
  
  // If no plan exists for today, generate fresh content
  if (!plan) {
    console.log(`No plan found for ${today}, generating fresh content...`);
    const { generateDailyPlan } = await import('./openai');
    plan = await generateDailyPlan(today);
    await savePlan(plan);
    console.log(`Generated and saved new plan for ${today}`);
  } else {
    console.log(`Found existing plan for ${today}`);
  }
  
  return plan;
}

// Add or update a plan
export async function savePlan(plan: DailyPlan): Promise<void> {
  const plans = await loadPlans();
  const existingIndex = plans.findIndex((p) => p.date === plan.date);

  if (existingIndex >= 0) {
    plans[existingIndex] = plan;
  } else {
    plans.push(plan);
  }

  // Clean up old plans (keep only last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const cutoffDate = thirtyDaysAgo.toISOString().split("T")[0];
  
  const recentPlans = plans.filter(p => p.date >= cutoffDate);

  // Sort plans by date
  recentPlans.sort((a, b) => a.date.localeCompare(b.date));

  await savePlans(recentPlans);
}

// Check if plan exists for date
export async function planExists(date: string): Promise<boolean> {
  const plan = await getPlanByDate(date);
  return plan !== null;
}

// Clean up old plans (keep only last 30 days)
export async function cleanupOldPlans(): Promise<void> {
  const plans = await loadPlans();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const cutoffDate = thirtyDaysAgo.toISOString().split("T")[0];
  
  const recentPlans = plans.filter(plan => plan.date >= cutoffDate);
  
  if (recentPlans.length !== plans.length) {
    console.log(`Cleaned up ${plans.length - recentPlans.length} old plans`);
    await savePlans(recentPlans);
  }
}
