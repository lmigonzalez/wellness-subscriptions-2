import OpenAI from 'openai';
import { DailyPlan, Exercise, Meal } from './data';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Generate only a daily quote
export async function generateDailyQuote(date: string): Promise<{ text: string; author: string }> {
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a wellness expert creating daily inspirational quotes. Generate a motivational quote about health, wellness, fitness, or personal growth.
          
          Return ONLY valid JSON in this exact format:
          {
            "text": "inspiring quote text here",
            "author": "Author Name or 'Unknown' if original"
          }`
        },
        {
          role: "user",
          content: `Create an inspiring wellness quote for ${dayOfWeek}, ${date}. 
          
          Make it:
          - Motivational and uplifting
          - Related to health, wellness, fitness, or personal growth
          - Appropriate for starting the day with positive energy
          - Either a famous quote or create an original one
          
          Return only the JSON, no other text.`
        }
      ],
      temperature: 0.8,
      max_tokens: 200,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content generated from OpenAI');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating daily quote with OpenAI:', error);
    return getFallbackQuote();
  }
}

// Generate monthly workout and meal plans
export async function generateMonthlyPlan(date: string): Promise<{ workout: Exercise[]; meals: { breakfast: Meal; lunch: Meal; dinner: Meal } }> {
  const month = new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a wellness expert creating monthly workout and meal plans. Generate a month-long fitness and nutrition program.
          
          Return ONLY valid JSON in this exact format:
          {
            "workout": [
              {
                "name": "Exercise Name",
                "description": "Description of the exercise",
                "duration": "Duration/time",
                "sets": "3" (optional),
                "reps": "10-15" (optional)
              }
            ],
            "meals": {
              "breakfast": {
                "name": "Meal Name",
                "description": "Brief description",
                "calories": 450,
                "ingredients": ["ingredient 1", "ingredient 2"],
                "instructions": ["step 1", "step 2"]
              },
              "lunch": { same format },
              "dinner": { same format }
            }
          }`
        },
        {
          role: "user",
          content: `Create a comprehensive wellness plan for ${month}. 
          
          Generate:
          - 7 varied exercises (mix of cardio, strength, flexibility, core work)
          - Each exercise should be suitable for daily repetition throughout the month
          - 3 nutritious meals (breakfast, lunch, dinner) with seasonal ingredients when possible
          - Meals should be balanced, realistic, and provide sustained energy
          - Focus on whole foods and balanced nutrition
          - Appropriate for general fitness levels
          
          This plan will be used for the entire month, so make exercises that can be done consistently.
          
          Return only the JSON, no other text.`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content generated from OpenAI');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating monthly plan with OpenAI:', error);
    return getFallbackMonthlyPlan();
  }
}

// Main function to generate daily plan (combines daily quote with monthly workout/meals)
export async function generateDailyPlan(date: string): Promise<DailyPlan> {
  const monthKey = new Date(date).toISOString().slice(0, 7); // YYYY-MM format
  
  try {
    // Get daily quote
    const quote = await generateDailyQuote(date);
    
    // Get or generate monthly plan
    const monthlyPlan = await getOrGenerateMonthlyPlan(monthKey);
    
    return {
      date,
      quote,
      workout: monthlyPlan.workout,
      meals: monthlyPlan.meals
    };
  } catch (error) {
    console.error('Error generating daily plan:', error);
    return getFallbackPlan(date);
  }
}

// Helper function to get or generate monthly plan
async function getOrGenerateMonthlyPlan(monthKey: string) {
  // In production (Vercel), we can't write to filesystem
  // So we'll always generate fresh monthly content
  if (process.env.NODE_ENV === 'production') {
    console.log(`Generating fresh monthly plan for ${monthKey} in production...`);
    return await generateMonthlyPlan(monthKey + '-01');
  }
  
  // In development, try to load existing monthly plan from storage
  try {
    const { loadMonthlyPlan, saveMonthlyPlan } = await import('./monthly-storage');
    let monthlyPlan = await loadMonthlyPlan(monthKey);
    
    if (!monthlyPlan) {
      // Generate new monthly plan
      console.log(`Generating new monthly plan for ${monthKey}...`);
      monthlyPlan = await generateMonthlyPlan(monthKey + '-01'); // Use first day of month
      await saveMonthlyPlan(monthKey, monthlyPlan);
      console.log(`Generated and saved monthly plan for ${monthKey}`);
    }
    
    return monthlyPlan;
  } catch (error) {
    console.error('Error with monthly plan storage:', error);
    return getFallbackMonthlyPlan();
  }
}

// Fallback quote if OpenAI is unavailable
function getFallbackQuote(): { text: string; author: string } {
  const quotes = [
    { text: "The groundwork for all happiness is good health.", author: "Leigh Hunt" },
    { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
    { text: "A healthy outside starts from the inside.", author: "Robert Urich" },
    { text: "Health is not about the weight you lose, but about the life you gain.", author: "Dr. Josh Axe" },
    { text: "Your body can stand almost anything. It's your mind you have to convince.", author: "Unknown" },
    { text: "The first wealth is health.", author: "Ralph Waldo Emerson" },
    { text: "To keep the body in good health is a duty... otherwise we shall not be able to keep our mind strong and clear.", author: "Buddha" }
  ];
  
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return quotes[dayOfYear % quotes.length];
}

// Fallback monthly plan if OpenAI is unavailable
function getFallbackMonthlyPlan(): { workout: Exercise[]; meals: { breakfast: Meal; lunch: Meal; dinner: Meal } } {
  return {
    workout: [
      {
        name: "Morning Stretch",
        description: "Full body stretching routine to start your day",
        duration: "10 minutes"
      },
      {
        name: "Push-ups",
        description: "Classic upper body strength exercise",
        duration: "3 sets",
        sets: "3",
        reps: "10-15"
      },
      {
        name: "Squats",
        description: "Lower body strength and mobility",
        duration: "3 sets",
        sets: "3",
        reps: "15-20"
      },
      {
        name: "Plank",
        description: "Core strengthening exercise",
        duration: "3 sets",
        sets: "3",
        reps: "30-60 seconds"
      },
      {
        name: "Jumping Jacks",
        description: "Cardio warm-up exercise",
        duration: "2 minutes"
      },
      {
        name: "Lunges",
        description: "Single leg strength and balance",
        duration: "3 sets",
        sets: "3",
        reps: "10 each leg"
      },
      {
        name: "Cool Down Walk",
        description: "Gentle walking to cool down",
        duration: "5 minutes"
      }
    ],
    meals: {
      breakfast: {
        name: "Protein Power Bowl",
        description: "Nutritious start with protein and healthy fats",
        calories: 450,
        ingredients: [
          "2 eggs",
          "1/2 avocado",
          "1 slice whole grain toast",
          "1 cup spinach",
          "1 tbsp olive oil",
          "Salt and pepper to taste"
        ],
        instructions: [
          "Heat olive oil in a pan over medium heat",
          "Sauté spinach until wilted",
          "Scramble eggs and add to pan",
          "Toast bread and top with sliced avocado",
          "Serve eggs over spinach with toast on the side"
        ]
      },
      lunch: {
        name: "Mediterranean Quinoa Salad",
        description: "Fresh and filling Mediterranean-inspired salad",
        calories: 520,
        ingredients: [
          "1 cup cooked quinoa",
          "1/2 cucumber, diced",
          "1/2 cup cherry tomatoes",
          "1/4 cup red onion",
          "1/4 cup feta cheese",
          "2 tbsp olive oil",
          "1 tbsp lemon juice",
          "Fresh herbs (parsley, mint)"
        ],
        instructions: [
          "Cook quinoa according to package instructions and let cool",
          "Dice cucumber, halve cherry tomatoes, and slice red onion",
          "Combine quinoa with vegetables and feta",
          "Whisk olive oil and lemon juice for dressing",
          "Toss salad with dressing and fresh herbs"
        ]
      },
      dinner: {
        name: "Grilled Salmon with Roasted Vegetables",
        description: "Omega-3 rich salmon with colorful roasted vegetables",
        calories: 580,
        ingredients: [
          "6 oz salmon fillet",
          "1 cup broccoli florets",
          "1 bell pepper, sliced",
          "1/2 zucchini, sliced",
          "2 tbsp olive oil",
          "1 lemon",
          "Garlic powder",
          "Salt and pepper"
        ],
        instructions: [
          "Preheat oven to 425°F",
          "Toss vegetables with 1 tbsp olive oil, salt, and pepper",
          "Roast vegetables for 20 minutes",
          "Season salmon with lemon, garlic powder, salt, and pepper",
          "Grill salmon for 4-5 minutes per side",
          "Serve salmon over roasted vegetables"
        ]
      }
    }
  };
}

// Fallback plan in case OpenAI is unavailable
function getFallbackPlan(date: string): DailyPlan {
  const quote = getFallbackQuote();
  const monthlyPlan = getFallbackMonthlyPlan();

  return {
    date,
    quote,
    workout: monthlyPlan.workout,
    meals: monthlyPlan.meals
  };
}
