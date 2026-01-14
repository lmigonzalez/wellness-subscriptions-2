import { DailyPlan } from "./data";
import { prisma, planToDB, dbToPlan } from "./prisma";

// Get plan by date from database
export async function getPlanByDate(date: string): Promise<DailyPlan | null> {
  try {
    const dbPlan = await prisma.dailyPlan.findUnique({
      where: { date }
    });

    if (!dbPlan) {
      return null;
    }

    // Parse JSON strings back to objects
    const workout = JSON.parse(dbPlan.workout);
    const meals = JSON.parse(dbPlan.meals);

    return dbToPlan({
      id: dbPlan.id,
      date: dbPlan.date,
      quoteText: dbPlan.quoteText,
      quoteAuthor: dbPlan.quoteAuthor,
      workout,
      meals,
      createdAt: dbPlan.createdAt,
      updatedAt: dbPlan.updatedAt
    });
  } catch (error) {
    console.error(`Error fetching plan for ${date}:`, error);
    return null;
  }
}

// Get today's plan from database
export async function getTodaysPlan(): Promise<DailyPlan | null> {
  const today = new Date().toISOString().split("T")[0];
  

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
    const dbData = planToDB(plan);
    
    // Convert workout and meals to JSON strings
    const workoutJson = JSON.stringify(dbData.workout);
    const mealsJson = JSON.stringify(dbData.meals);

    await prisma.dailyPlan.upsert({
      where: { date: plan.date },
      update: {
        quoteText: dbData.quoteText,
        quoteAuthor: dbData.quoteAuthor,
        workout: workoutJson,
        meals: mealsJson
      },
      create: {
        date: dbData.date,
        quoteText: dbData.quoteText,
        quoteAuthor: dbData.quoteAuthor,
        workout: workoutJson,
        meals: mealsJson
      }
    });

    console.log(`Plan saved to database for ${plan.date}`);
  } catch (error: unknown) {
    console.error('Error in savePlan:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : 'No details',
    });
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
    
    const result = await prisma.dailyPlan.deleteMany({
      where: {
        date: {
          lt: cutoffDate
        }
      }
    });

    if (result.count > 0) {
      console.log(`Cleaned up ${result.count} old plans before ${cutoffDate}`);
    }
  } catch (error) {
    console.error('Error in cleanupOldPlans:', error);
  }
}

// Get all plans (for admin purposes)
export async function getAllPlans(): Promise<DailyPlan[]> {
  try {
    const dbPlans = await prisma.dailyPlan.findMany({
      orderBy: {
        date: 'desc'
      }
    });

    return dbPlans.map((dbPlan: Awaited<ReturnType<typeof prisma.dailyPlan.findMany>>[0]) => {
      const workout = JSON.parse(dbPlan.workout);
      const meals = JSON.parse(dbPlan.meals);
      
      return dbToPlan({
        id: dbPlan.id,
        date: dbPlan.date,
        quoteText: dbPlan.quoteText,
        quoteAuthor: dbPlan.quoteAuthor,
        workout,
        meals,
        createdAt: dbPlan.createdAt,
        updatedAt: dbPlan.updatedAt
      });
    });
  } catch (error) {
    console.error('Error in getAllPlans:', error);
    return [];
  }
}
