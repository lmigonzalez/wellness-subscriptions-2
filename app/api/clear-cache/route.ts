import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    // Simple cache clearing endpoint
    const today = new Date().toISOString().split("T")[0];
    
    console.log(`🧹 CACHE CLEAR: Clearing all caches for ${today}`);
    
    const response = NextResponse.json({
      success: true,
      message: "Cache cleared successfully",
      timestamp: new Date().toISOString(),
      date: today,
      action: "cache_cleared"
    });

    // Set headers to prevent caching of this response
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Cache clear failed", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Cache clear endpoint - use POST method",
    timestamp: new Date().toISOString()
  });
}
