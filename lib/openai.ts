import OpenAI from 'openai';
import { DailyPlan, Exercise, Meal } from './data';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Generate only a daily quote
export async function generateDailyQuote(date: string): Promise<{ text: string; author: string }> {
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
  const month = new Date(date).toLocaleDateString('en-US', { month: 'long' });
  const day = new Date(date).getDate();
  
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
          }
          
          Make sure the quote is:
          - Unique and inspiring for the specific day
          - Related to health, wellness, fitness, or personal growth
          - Appropriate for starting the day with positive energy
          - Either a famous quote or create an original one
          - Different from common wellness quotes`
        },
        {
          role: "user",
          content: `Create an inspiring wellness quote for ${dayOfWeek}, ${month} ${day}, ${date}. 
          
          Make it:
          - Motivational and uplifting
          - Related to health, wellness, fitness, or personal growth
          - Appropriate for starting the day with positive energy
          - Either a famous quote or create an original one
          - Unique and fresh for this specific day
          
          Return only the JSON, no other text.`
        }
      ],
      temperature: 0.9,
      max_tokens: 200,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content generated from OpenAI');
    }

    // Try to parse the JSON response
    try {
      const parsed = JSON.parse(content);
      if (parsed.text && parsed.author) {
        return parsed;
      }
      throw new Error('Invalid quote format');
    } catch {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Invalid response format from OpenAI');
    }
  } catch (error) {
    console.error('Error generating daily quote with OpenAI:', error);
    return getFallbackQuote(date);
  }
}

// Generate daily workout and meal plans
export async function generateDailyWorkout(date: string): Promise<Exercise[]> {
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
  const dayOfMonth = new Date(date).getDate();
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a fitness expert creating daily home workout routines. Generate exactly 7 bodyweight exercises that can be done at home with no equipment.
          
          Return ONLY valid JSON in this exact format:
          [
            {
              "name": "Exercise Name",
              "description": "Clear description of proper form and technique",
              "duration": "Total time or set duration",
              "sets": "3",
              "reps": "10-15"
            }
          ]
          
          REQUIREMENTS:
          - Exactly 7 exercises
          - All bodyweight/home exercises (no equipment needed)
          - Must include: planks, sit-ups/crunches, push-ups
          - Add 4 more exercises like squats, lunges, jumping jacks, burpees, mountain climbers, etc.
          - Each exercise must have sets and reps specified
          - Vary the intensity and muscle groups
          - Suitable for all fitness levels with modifications mentioned`
        },
        {
          role: "user",
          content: `Create a daily home workout for ${dayOfWeek}, day ${dayOfMonth} of the month.
          
          Generate exactly 7 bodyweight exercises:
          1. Must include: Planks (with duration)
          2. Must include: Sit-ups or Crunches (with sets/reps)
          3. Must include: Push-ups (with sets/reps)
          4-7. Add 4 more varied home exercises like squats, lunges, jumping jacks, burpees, mountain climbers, etc.
          
          Requirements:
          - All exercises doable at home with no equipment
          - Clear sets and reps for each
          - Mix of cardio, strength, and core
          - Beginner to intermediate difficulty
          - Total workout should take 20-30 minutes
          
          Return only the JSON array, no other text.`
        }
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content generated from OpenAI');
    }

    // Try to parse the JSON response
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length === 7) {
        return parsed;
      }
      throw new Error('Invalid workout format - must be exactly 7 exercises');
    } catch {
      console.error('Failed to parse OpenAI workout response:', content);
      throw Error('Invalid response format from OpenAI');
    }
  } catch (error) {
    console.error('Error generating daily workout with OpenAI:', error);
    return getFallbackDailyWorkout();
  }
}

// Generate daily meal plans
export async function generateDailyMeals(date: string): Promise<{ breakfast: Meal; lunch: Meal; dinner: Meal }> {
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
  const month = new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const season = getSeason(date);
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a nutrition expert creating daily meal plans. Generate 3 nutritious meals for the specific day.
          
          Return ONLY valid JSON in this exact format:
          {
            "breakfast": {
              "name": "Meal Name",
              "description": "Brief description",
              "calories": 450,
              "ingredients": ["ingredient 1", "ingredient 2"],
              "instructions": ["step 1", "step 2"]
            },
            "lunch": { same format },
            "dinner": { same format }
          }`
        },
        {
          role: "user",
          content: `Create nutritious meals for ${dayOfWeek}, ${month} (${season} season). 
          
          Generate:
          - 3 nutritious meals (breakfast, lunch, dinner) with seasonal ingredients for ${season}
          - Meals should be balanced, realistic, and provide sustained energy
          - Focus on whole foods and balanced nutrition
          - Consider seasonal availability for ${season}
          - Appropriate for general dietary needs
          - Make each day unique and varied
          
          Return only the JSON, no other text.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content generated from OpenAI');
    }

    // Try to parse the JSON response
    try {
      const parsed = JSON.parse(content);
      if (parsed.breakfast && parsed.lunch && parsed.dinner) {
        return parsed;
      }
      throw new Error('Invalid meal plan format');
    } catch {
      console.error('Failed to parse OpenAI meals response:', content);
      throw new Error('Invalid response format from OpenAI');
    }
  } catch (error) {
    console.error('Error generating daily meals with OpenAI:', error);
    return getFallbackDailyMeals();
  }
}

// Helper function to determine season
function getSeason(date: string): string {
  const month = new Date(date).getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}

// Main function to generate daily plan (combines daily quote, workout, and meals)
export async function generateDailyPlan(date: string): Promise<DailyPlan> {
  
  try {
    // Get daily quote
    console.log(`Generating daily quote for ${date}...`);
    const quote = await generateDailyQuote(date);
    console.log(`Generated quote: "${quote.text}" by ${quote.author}`);
    
    // Get daily workout
    console.log(`Generating daily workout for ${date}...`);
    const workout = await generateDailyWorkout(date);
    console.log(`Generated daily workout with ${workout.length} exercises`);
    
    // Get or generate daily meals
    const dailyMeals = await getOrGenerateDailyMeals(date);
    
    return {
      date,
      quote,
      workout,
      meals: dailyMeals
    };
  } catch (error) {
    console.error('Error generating daily plan:', error);
    return getFallbackPlan(date);
  }
}

// Helper function to get or generate daily meals
async function getOrGenerateDailyMeals(date: string) {
  // In production (Vercel), we can't write to filesystem
  // So we'll always generate fresh daily content
  if (process.env.NODE_ENV === 'production') {
    console.log(`Generating fresh daily meals for ${date} in production...`);
    return await generateDailyMeals(date);
  }
  
  // In development, try to load existing daily meals from storage
  try {
    const { getPlanByDate, savePlan } = await import('./storage');
    const existingPlan = await getPlanByDate(date);
    
    if (!existingPlan || !existingPlan.meals) {
      // Generate new daily meals
      console.log(`Generating new daily meals for ${date}...`);
      const dailyMeals = await generateDailyMeals(date);
      const planToSave = { 
        date,
        quote: { text: "Fallback quote", author: "Unknown" },
        workout: [],
        meals: dailyMeals
      };
      await savePlan(planToSave);
      console.log(`Generated and saved daily meals for ${date}`);
      return dailyMeals;
    } else {
      console.log(`Loaded existing daily meals for ${date}`);
      return existingPlan.meals;
    }
  } catch (error) {
    console.error('Error with daily meals storage:', error);
    return getFallbackDailyMeals();
  }
}

// Fallback quote if OpenAI is unavailable - now includes date-based variation
function getFallbackQuote(date: string): { text: string; author: string } {
  const quotes = [
    { text: "The groundwork for all happiness is good health.", author: "Leigh Hunt" },
    { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
    { text: "A healthy outside starts from the inside.", author: "Robert Urich" },
    { text: "Health is not about the weight you lose, but about the life you gain.", author: "Dr. Josh Axe" },
    { text: "Your body can stand almost anything. It's your mind you have to convince.", author: "Unknown" },
    { text: "The first wealth is health.", author: "Ralph Waldo Emerson" },
    { text: "To keep the body in good health is a duty... otherwise we shall not be able to keep our mind strong and clear.", author: "Buddha" },
    { text: "Every morning is a fresh start, an opportunity to nourish your body, cultivate your mind, and strengthen your spirit.", author: "Unknown" },
    { text: "Wellness is the complete integration of body, mind, and spirit.", author: "Greg Anderson" },
    { text: "The greatest wealth is health.", author: "Virgil" },
    { text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
    { text: "Your health is an investment, not an expense.", author: "Unknown" }
  ];
  
  // Use date to ensure consistent but varied quotes
  const today = new Date(date);
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return quotes[dayOfYear % quotes.length];
}

// Fallback daily workout if OpenAI is unavailable
function getFallbackDailyWorkout(): Exercise[] {
  return [
    {
      name: "Plank",
      description: "Hold your body straight like a board, engaging your core muscles",
      duration: "3 sets",
      sets: "3",
      reps: "30-60 seconds"
    },
    {
      name: "Push-ups",
      description: "Classic upper body strength exercise. Modify on knees if needed",
      duration: "3 sets",
      sets: "3",
      reps: "8-15"
    },
    {
      name: "Sit-ups",
      description: "Core strengthening exercise. Keep your feet flat on the ground",
      duration: "3 sets",
      sets: "3",
      reps: "10-20"
    },
    {
      name: "Squats",
      description: "Lower body strength. Keep your chest up and knees behind toes",
      duration: "3 sets",
      sets: "3",
      reps: "12-20"
    },
    {
      name: "Lunges",
      description: "Alternate legs for balance and strength training",
      duration: "3 sets",
      sets: "3",
      reps: "10 each leg"
    },
    {
      name: "Jumping Jacks",
      description: "Full body cardio exercise to get your heart rate up",
      duration: "3 sets",
      sets: "3",
      reps: "30 seconds"
    },
    {
      name: "Mountain Climbers",
      description: "High-intensity core and cardio exercise in plank position",
      duration: "3 sets",
      sets: "3",
      reps: "20 seconds"
    }
  ];
}

// Fallback daily meals if OpenAI is unavailable
function getFallbackDailyMeals(): { breakfast: Meal; lunch: Meal; dinner: Meal } {
  return {
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
  };
}

// Fallback plan in case OpenAI is unavailable
function getFallbackPlan(date: string): DailyPlan {
  const quote = getFallbackQuote(date);
  const dailyWorkout = getFallbackDailyWorkout();
      const dailyMeals = getFallbackDailyMeals();

      return {
      date,
      quote,
      workout: dailyWorkout,
      meals: dailyMeals
    };
}
