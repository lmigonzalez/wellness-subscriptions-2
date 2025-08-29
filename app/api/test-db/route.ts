import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateDailyPlan } from "@/lib/openai";
import { savePlan, getPlanByDate } from "@/lib/storage";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const today = new Date().toISOString().split("T")[0];
    
    console.log(`🧪 Testing database operations for ${today}`);
    
    // Step 1: Check if plan exists
    console.log("Step 1: Checking existing plan...");
    const existingPlan = await getPlanByDate(today);
    console.log("Existing plan:", existingPlan ? "Found" : "Not found");
    
    // Step 2: Generate fresh plan
    console.log("Step 2: Generating fresh plan...");
    const freshPlan = await generateDailyPlan(today);
    console.log("Fresh plan generated:", {
      date: freshPlan.date,
      workoutCount: freshPlan.workout?.length || 0,
      hasBreakfast: !!freshPlan.meals?.breakfast
    });
    
    // Step 3: Save to database
    console.log("Step 3: Saving to database...");
    await savePlan(freshPlan);
    console.log("Plan saved successfully");
    
    // Step 4: Retrieve from database
    console.log("Step 4: Retrieving from database...");
    const retrievedPlan = await getPlanByDate(today);
    console.log("Retrieved plan:", {
      date: retrievedPlan?.date,
      workoutCount: retrievedPlan?.workout?.length || 0,
      hasBreakfast: !!retrievedPlan?.meals?.breakfast
    });
    
    // Step 5: Test direct database query
    console.log("Step 5: Testing direct database query...");
    const { data: dbData, error: dbError } = await supabase
      .from('daily_plans')
      .select('*')
      .eq('date', today)
      .single();
    
    if (dbError) {
      console.error("Database error:", dbError);
    } else {
      console.log("Direct DB query result:", {
        date: dbData?.date,
        workoutLength: Array.isArray(dbData?.workout) ? dbData.workout.length : "Not array",
        mealsType: typeof dbData?.meals
      });
    }
    
    return NextResponse.json({
      success: true,
      today,
      tests: {
        existingPlan: !!existingPlan,
        freshPlanGenerated: !!freshPlan,
        savedSuccessfully: true,
        retrievedPlan: !!retrievedPlan,
        directDbQuery: !!dbData && !dbError
      },
      data: {
        generated: {
          workoutCount: freshPlan.workout?.length || 0,
          hasBreakfast: !!freshPlan.meals?.breakfast
        },
        retrieved: {
          workoutCount: retrievedPlan?.workout?.length || 0,
          hasBreakfast: !!retrievedPlan?.meals?.breakfast
        },
        direct: {
          workoutLength: Array.isArray(dbData?.workout) ? dbData.workout.length : "Not array",
          mealsType: typeof dbData?.meals
        }
      },
      errors: dbError ? [dbError] : []
    });
    
  } catch (error) {
    console.error("Test DB error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 });
  }
}
