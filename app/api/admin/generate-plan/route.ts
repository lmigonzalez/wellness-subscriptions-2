import { NextRequest, NextResponse } from 'next/server';
import { generateDailyPlan } from '@/lib/openai';
import { savePlan, planExists } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const { date, force = false } = await request.json();
    
    if (!date) {
      return NextResponse.json(
        { error: 'Date is required (YYYY-MM-DD format)' },
        { status: 400 }
      );
    }

    // Check if plan already exists
    if (!force && await planExists(date)) {
      return NextResponse.json(
        { error: 'Plan already exists for this date. Use force=true to overwrite.' },
        { status: 409 }
      );
    }

    console.log(`Generating plan for ${date}...`);
    const plan = await generateDailyPlan(date);
    await savePlan(plan);
    
    return NextResponse.json({
      success: true,
      message: `Plan generated and saved for ${date}`,
      plan
    });

  } catch (error) {
    console.error('Error generating plan:', error);
    return NextResponse.json(
      { error: 'Failed to generate plan', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check if plan exists for a date
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    const exists = await planExists(date);
    return NextResponse.json({ date, exists });

  } catch (error) {
    console.error('Error checking plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
