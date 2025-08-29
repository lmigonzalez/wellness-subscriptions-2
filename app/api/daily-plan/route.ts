import { NextRequest, NextResponse } from "next/server";
import { getTodaysPlan, getPlanByDate, savePlan } from "@/lib/storage";
import { generateDailyPlan } from "@/lib/openai";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const forceRefresh = searchParams.get("refresh") === "true";
    const today = new Date().toISOString().split("T")[0];
    
    // Debug logging
    console.log(`API Request - Environment: ${process.env.NODE_ENV}, Date: ${date || 'today'}, Force Refresh: ${forceRefresh}, Today: ${today}`);

    let plan;
    if (date) {
      // If specific date requested, try to get from storage
      plan = await getPlanByDate(date);
    } else {
      // For today's plan, handle production vs development differently
      if (process.env.NODE_ENV === 'production' || forceRefresh) {
        // In production or when force refresh is requested, always generate fresh content for today
        console.log(`${process.env.NODE_ENV === 'production' ? 'Production' : 'Force refresh'} mode: Generating fresh daily plan for ${today}`);
        plan = await generateDailyPlan(today);
      } else {
        // In development, try to get from storage first, then generate if needed
        plan = await getTodaysPlan();
        
        if (!plan) {
          console.log(`Development mode: No plan found for ${today}, generating with OpenAI...`);
          plan = await generateDailyPlan(today);
          await savePlan(plan);
          console.log("Generated and saved new plan for today");
        }
      }
    }

    if (!plan) {
      return NextResponse.json(
        { error: "No plan found for the specified date" },
        { status: 404 }
      );
    }

    // Add metadata to response
    const response = {
      ...plan,
      _metadata: {
        generatedAt: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        isFreshContent: !date && process.env.NODE_ENV === 'production'
      }
    };

    // Set cache control headers to prevent caching in production
    const nextResponse = NextResponse.json(response);
    if (process.env.NODE_ENV === 'production') {
      nextResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      nextResponse.headers.set('Pragma', 'no-cache');
      nextResponse.headers.set('Expires', '0');
    }

    return nextResponse;
  } catch (error) {
    console.error("Error fetching daily plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
