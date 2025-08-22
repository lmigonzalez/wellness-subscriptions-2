import OpenAI from 'openai';
import { DailyPlan, Exercise, Meal } from './data';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateDailyPlan(date: string): Promise<DailyPlan> {
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a wellness expert creating comprehensive daily wellness plans. Generate a complete daily plan with:
          1. An inspiring quote with author
          2. 7 varied exercises with proper descriptions, durations, sets, and reps
          3. 3 healthy meals (breakfast, lunch, dinner) with ingredients and cooking instructions
          
          Return ONLY valid JSON in this exact format:
          {
            "quote": {
              "text": "quote text here",
              "author": "Author Name"
            },
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
          content: `Create a wellness plan for ${dayOfWeek}, ${date}. 
          
          Make it:
          - Motivational and energizing
          - Include 7 diverse exercises (mix of cardio, strength, flexibility)
          - 3 nutritious meals with realistic portions and clear cooking steps
          - Appropriate for general fitness levels
          - Focus on whole foods and balanced nutrition
          
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

    // Parse the JSON response
    const generatedContent = JSON.parse(content);
    
    // Create the full daily plan
    const dailyPlan: DailyPlan = {
      date,
      quote: generatedContent.quote,
      workout: generatedContent.workout,
      meals: generatedContent.meals
    };

    return dailyPlan;
    
  } catch (error) {
    console.error('Error generating daily plan with OpenAI:', error);
    
    // Fallback plan if OpenAI fails
    return getFallbackPlan(date);
  }
}

// Fallback plan in case OpenAI is unavailable
function getFallbackPlan(date: string): DailyPlan {
  const quotes = [
    { text: "The groundwork for all happiness is good health.", author: "Leigh Hunt" },
    { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
    { text: "A healthy outside starts from the inside.", author: "Robert Urich" },
    { text: "Health is not about the weight you lose, but about the life you gain.", author: "Dr. Josh Axe" },
    { text: "Your body can stand almost anything. It's your mind you have to convince.", author: "Unknown" }
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return {
    date,
    quote: randomQuote,
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
