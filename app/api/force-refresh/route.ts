import { NextResponse } from "next/server";
import { generateDailyPlan } from "@/lib/openai";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const today = new Date().toISOString().split("T")[0];
    
    console.log(`🔥 FORCE REFRESH: Generating completely fresh plan for ${today}`);
    
    // Always generate fresh content, bypassing all caches
    const plan = await generateDailyPlan(today);
    
    const response = {
      ...plan,
      _forceRefresh: true,
      _generatedAt: new Date().toISOString(),
      _timestamp: Date.now(),
      _message: "This is guaranteed fresh content generated just now"
    };

    const nextResponse = NextResponse.json(response);
    
    // Ultra-aggressive cache prevention
    nextResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0, proxy-revalidate');
    nextResponse.headers.set('Pragma', 'no-cache');
    nextResponse.headers.set('Expires', '0');
    nextResponse.headers.set('Last-Modified', new Date().toUTCString());
    nextResponse.headers.set('Vary', '*');
    nextResponse.headers.set('X-Vercel-Cache', 'MISS');
    nextResponse.headers.set('CDN-Cache-Control', 'no-cache');
    nextResponse.headers.set('Vercel-CDN-Cache-Control', 'no-cache');
    nextResponse.headers.set('X-Force-Refresh', 'true');

    return nextResponse;
  } catch (error) {
    console.error("Error in force refresh:", error);
    return NextResponse.json(
      { error: "Force refresh failed", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
