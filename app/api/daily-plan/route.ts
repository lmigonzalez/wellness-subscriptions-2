import { NextRequest, NextResponse } from "next/server";
import { getTodaysPlan, getPlanByDate, savePlan } from "@/lib/storage";
import { generateDailyPlan } from "@/lib/openai";

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
      // For today's plan, use database-first approach unless force refresh is requested
      const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
      
      if (isProduction && forceRefresh) {
        // Only generate fresh content when explicitly requested via force refresh
        console.log(`Force refresh mode: Generating fresh daily plan for ${today}`);
        console.log(`Environment variables: NODE_ENV=${process.env.NODE_ENV}, VERCEL=${process.env.VERCEL}`);
        
        try {
          plan = await generateDailyPlan(today);
          await savePlan(plan);
          console.log(`Successfully generated and saved fresh plan for ${today}`);
        } catch (error) {
          console.error(`Error generating plan: ${error}`);
          // If OpenAI fails during force refresh, try to get existing plan from database
          plan = await getTodaysPlan();
          if (!plan) {
            // If no existing plan, return a fallback plan with today's date
          plan = {
            date: today,
            quote: {
              text: "The groundwork of all happiness is health.",
              author: "Leigh Hunt"
            },
            workout: [
              {
                name: "Plank",
                description: "Hold your body straight like a board, engaging your core muscles",
                duration: "30-60 seconds",
                sets: "3",
                reps: "30-60 seconds"
              },
              {
                name: "Push-ups", 
                description: "Classic upper body strength exercise. Modify on knees if needed",
                duration: "",
                sets: "3",
                reps: "8-15"
              },
              {
                name: "Sit-ups",
                description: "Core strengthening exercise. Keep your feet flat on the ground", 
                duration: "",
                sets: "3",
                reps: "15"
              },
              {
                name: "Squats",
                description: "Lower body strength. Keep your chest up and knees behind toes",
                duration: "",
                sets: "3", 
                reps: "15"
              },
              {
                name: "Lunges",
                description: "Alternate legs for balance and strength training",
                duration: "",
                sets: "3",
                reps: "10 each leg"
              },
              {
                name: "Jumping Jacks",
                description: "Full body cardio exercise to get your heart rate up",
                duration: "30 seconds",
                sets: "3",
                reps: "30 seconds"
              },
              {
                name: "Mountain Climbers",
                description: "High-intensity core and cardio exercise in plank position",
                duration: "20 seconds",
                sets: "3", 
                reps: "20 seconds"
              }
            ],
            meals: {
              breakfast: {
                name: "Protein Power Bowl",
                description: "Nutritious start with protein and healthy fats",
                calories: 450,
                ingredients: ["2 eggs", "1/2 avocado", "1 slice whole grain toast", "1 cup spinach", "1 tbsp olive oil"],
                instructions: ["Heat olive oil in a pan", "Sauté spinach until wilted", "Scramble eggs", "Toast bread and top with avocado", "Serve eggs over spinach"]
              },
              lunch: {
                name: "Mediterranean Quinoa Salad", 
                description: "Fresh and filling Mediterranean-inspired salad",
                calories: 520,
                ingredients: ["1 cup cooked quinoa", "1/2 cucumber", "1/2 cup cherry tomatoes", "1/4 cup feta cheese", "2 tbsp olive oil"],
                instructions: ["Cook quinoa and let cool", "Dice vegetables", "Combine with feta", "Dress with olive oil and lemon"]
              },
              dinner: {
                name: "Grilled Salmon with Roasted Vegetables",
                description: "Omega-3 rich salmon with colorful roasted vegetables", 
                calories: 580,
                ingredients: ["6 oz salmon fillet", "1 cup broccoli", "1 bell pepper", "1/2 zucchini", "2 tbsp olive oil"],
                instructions: ["Preheat oven to 425°F", "Roast vegetables for 20 minutes", "Grill salmon 4-5 minutes per side", "Serve together"]
              }
            }
            };
            console.log(`Using fallback plan for ${today} due to OpenAI error`);
          }
        }
      } else {
        // In all other cases (development or production without force refresh), use database-first approach
        console.log(`Database-first mode: Checking storage for ${today}`);
        plan = await getTodaysPlan();
        
        if (!plan) {
          console.log(`No plan found for ${today}, generating with OpenAI...`);
          plan = await generateDailyPlan(today);
          await savePlan(plan);
          console.log("Generated and saved new plan for today");
        } else {
          console.log(`Found existing plan in database for ${today}`);
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
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    const response = {
      ...plan,
      _metadata: {
        generatedAt: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        vercelDetected: !!process.env.VERCEL,
        isFreshContent: !date && isProduction,
        forceRefresh: forceRefresh
      }
    };

    // Set aggressive cache control headers to prevent any caching
    const nextResponse = NextResponse.json(response);
    
    // Aggressive cache prevention
    nextResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0');
    nextResponse.headers.set('Pragma', 'no-cache');
    nextResponse.headers.set('Expires', '0');
    nextResponse.headers.set('Last-Modified', new Date().toUTCString());
    nextResponse.headers.set('Vary', '*');
    
    // Vercel-specific headers
    nextResponse.headers.set('X-Vercel-Cache', 'MISS');
    nextResponse.headers.set('CDN-Cache-Control', 'no-cache');
    nextResponse.headers.set('Vercel-CDN-Cache-Control', 'no-cache');

    return nextResponse;
  } catch (error) {
    console.error("Error fetching daily plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
