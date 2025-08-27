import { NextRequest, NextResponse } from 'next/server';
import { generateMonthlyMeals } from '@/lib/openai';
import { saveMonthlyPlan } from '@/lib/monthly-storage';

export async function POST(request: NextRequest) {
  try {
    // Verify this is a legitimate admin request
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { monthKey } = await request.json();
    
    if (!monthKey || !/^\d{4}-\d{2}$/.test(monthKey)) {
      return NextResponse.json(
        { error: 'Invalid month key. Use format YYYY-MM' },
        { status: 400 }
      );
    }

    console.log(`Admin requested monthly plan generation for ${monthKey}...`);
    
    // Generate new monthly meals
    const monthlyMeals = await generateMonthlyMeals(monthKey + '-01');
    
    // Create the monthly plan structure (meals only, workouts are now daily)
    const monthlyPlan = {
      workout: [], // Empty array since workouts are now generated daily
      meals: monthlyMeals
    };
    
    // Save the plan
    await saveMonthlyPlan(monthKey, monthlyPlan);
    
    console.log(`Successfully generated and saved monthly plan for ${monthKey}`);

    return NextResponse.json({
      success: true,
      message: `Monthly plan generated for ${monthKey}`,
      monthKey,
      plan: monthlyPlan
    });

  } catch (error) {
    console.error('Error generating monthly plan:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Also allow GET for testing purposes
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const monthKey = searchParams.get('monthKey');
  
  if (!monthKey) {
    return NextResponse.json({
      message: 'Monthly plan generation endpoint. Use POST with monthKey (YYYY-MM) to generate a plan.',
      example: '/api/admin/generate-monthly-plan?monthKey=2025-01'
    });
  }

  if (!/^\d{4}-\d{2}$/.test(monthKey)) {
    return NextResponse.json({
      error: 'Invalid month key format. Use YYYY-MM format.',
      example: '2025-01'
    }, { status: 400 });
  }

  return NextResponse.json({
    message: `Ready to generate monthly plan for ${monthKey}`,
    monthKey,
    usage: 'Send POST request with monthKey in body to generate plan'
  });
}
