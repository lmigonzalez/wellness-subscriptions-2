export interface Exercise {
  name: string;
  description: string;
  duration: string;
  sets?: string;
  reps?: string;
}

export interface Meal {
  name: string;
  description: string;
  calories: number;
  ingredients: string[];
  instructions: string[];
}

export interface DailyPlan {
  date: string; // YYYY-MM-DD format
  quote: {
    text: string;
    author: string;
  };
  workout: Exercise[];
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
  };
}

// Sample data for daily plans
export const samplePlans: DailyPlan[] = [
  {
    date: new Date().toISOString().split('T')[0], // Today's date
    quote: {
      text: "The groundwork for all happiness is good health.",
      author: "Leigh Hunt"
    },
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
  }
];

export function getTodaysPlan(): DailyPlan | null {
  const today = new Date().toISOString().split('T')[0];
  return samplePlans.find(plan => plan.date === today) || samplePlans[0];
}

export function getPlanByDate(date: string): DailyPlan | null {
  return samplePlans.find(plan => plan.date === date) || null;
}
