import { NextRequest, NextResponse } from "next/server";
import { getTodaysPlan, getPlanByDate, savePlan } from "@/lib/storage";
import { generateDailyPlan } from "@/lib/openai";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    let plan;
    if (date) {
      plan = await getPlanByDate(date);
    } else {
      plan = await getTodaysPlan();

      // If no plan exists for today, generate one with OpenAI
      if (!plan) {
        const today = new Date().toISOString().split("T")[0];
        console.log("No plan found for today, generating with OpenAI...");
        plan = await generateDailyPlan(today);
        await savePlan(plan);
        console.log("Generated and saved new plan for today");
      }
    }

    if (!plan) {
      return NextResponse.json(
        { error: "No plan found for the specified date" },
        { status: 404 }
      );
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Error fetching daily plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
