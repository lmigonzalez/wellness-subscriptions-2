import { NextResponse } from "next/server";

export async function GET() {
  const today = new Date().toISOString().split("T")[0];
  
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    today: today,
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      isProduction: process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
    },
    openai: {
      configured: !!process.env.OPENAI_API_KEY,
      keyLength: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0
    },
    message: "Debug endpoint for production troubleshooting"
  });
}
