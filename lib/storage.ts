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
  let plan = await getPlanByDate(today);
  
  // If no plan exists for today, check if we need to generate a new one
  if (!plan) {
    const { generateDailyPlan } = await import('./openai');
    plan = await generateDailyPlan(today);
    await savePlan(plan);
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

  // Sort plans by date
  plans.sort((a, b) => a.date.localeCompare(b.date));

  await savePlans(plans);
}

// Check if plan exists for date
export async function planExists(date: string): Promise<boolean> {
  const plan = await getPlanByDate(date);
  return plan !== null;
}
