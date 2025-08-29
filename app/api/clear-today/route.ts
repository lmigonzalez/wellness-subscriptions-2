import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST() {
  try {
    const today = new Date().toISOString().split("T")[0];
    
    console.log(`🗑️ Clearing today's plan from database: ${today}`);
    
    const { error } = await supabase
      .from('daily_plans')
      .delete()
      .eq('date', today);

    if (error) {
      console.error('Error clearing today\'s plan:', error);
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    console.log(`✅ Successfully cleared plan for ${today}`);
    
    return NextResponse.json({
      success: true,
      message: `Cleared plan for ${today}`,
      date: today
    });
    
  } catch (error) {
    console.error("Error in clear-today:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST to clear today's plan from database",
    endpoint: "/api/clear-today"
  });
}
