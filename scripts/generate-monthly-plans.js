#!/usr/bin/env node

/**
 * Utility script to generate fresh monthly plans
 * Run with: node scripts/generate-monthly-plans.js
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateMonthlyPlans() {
  try {
    console.log('🚀 Starting monthly plan generation...\n');
    
    // Get current month and next 2 months
    const currentDate = new Date();
    const months = [];
    
    for (let i = 0; i < 3; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
      months.push(monthKey);
    }
    
    console.log('📅 Checking plans for months:', months.join(', '), '\n');
    
    // Load existing monthly plans
    const monthlyPlansPath = path.join(__dirname, '..', 'data', 'monthly-plans.json');
    let monthlyPlans = {};
    
    try {
      const existingData = await fs.readFile(monthlyPlansPath, 'utf-8');
      monthlyPlans = JSON.parse(existingData);
    } catch (error) {
      console.log('   ℹ️  No existing monthly plans found, starting fresh...');
    }
    
    for (const monthKey of months) {
      console.log(`📋 Processing ${monthKey}...`);
      
      // Check if plan already exists
      if (monthlyPlans[monthKey]) {
        console.log(`   ⚠️  Plan already exists for ${monthKey}, skipping...`);
        continue;
      }
      
      try {
        // Generate a sample monthly plan (since we can't import the OpenAI module)
        console.log(`   🔄 Creating sample plan for ${monthKey}...`);
        
        const season = getSeason(monthKey);
        const monthlyPlan = createSampleMonthlyPlan(monthKey, season);
        
        // Save the plan
        monthlyPlans[monthKey] = monthlyPlan;
        
        console.log(`   ✅ Successfully created sample plan for ${monthKey}`);
        console.log(`      💪 ${monthlyPlan.workout.length} exercises`);
        console.log(`      🥗 3 meals (breakfast, lunch, dinner)`);
        
      } catch (error) {
        console.error(`   ❌ Error creating plan for ${monthKey}:`, error.message);
      }
      
      console.log(''); // Empty line for readability
    }
    
    // Save all plans back to file
    try {
      await fs.writeFile(monthlyPlansPath, JSON.stringify(monthlyPlans, null, 2));
      console.log('💾 All monthly plans saved to file');
    } catch (error) {
      console.error('❌ Error saving monthly plans:', error.message);
    }
    
    console.log('\n🎉 Monthly plan generation complete!');
    
    // Show summary of what was generated
    console.log('\n📊 Summary:');
    for (const monthKey of months) {
      if (monthlyPlans[monthKey]) {
        const plan = monthlyPlans[monthKey];
        console.log(`   ${monthKey}: ✅ Generated (${plan.workout.length} exercises)`);
      } else {
        console.log(`   ${monthKey}: ❌ Failed`);
      }
    }
    
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
}

// Helper function to determine season
function getSeason(monthKey) {
  const month = parseInt(monthKey.split('-')[1]);
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'fall';
  return 'winter';
}

// Create a sample monthly plan
function createSampleMonthlyPlan(monthKey, season) {
  const month = new Date(monthKey + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  return {
    workout: [
      {
        name: "Morning Warm-up",
        description: "Gentle stretching and mobility exercises to start your day",
        duration: "15 minutes"
      },
      {
        name: "Cardio Session",
        description: "Moderate intensity cardio workout for heart health",
        duration: "25 minutes",
        sets: "1"
      },
      {
        name: "Strength Training",
        description: "Full body strength exercises using body weight or light weights",
        duration: "30 minutes",
        sets: "3",
        reps: "12-15"
      },
      {
        name: "Core Workout",
        description: "Targeted core strengthening exercises",
        duration: "15 minutes",
        sets: "3",
        reps: "20"
      },
      {
        name: "Flexibility Training",
        description: "Yoga-inspired stretches to improve flexibility",
        duration: "20 minutes"
      },
      {
        name: "Balance Exercises",
        description: "Single-leg stands and balance challenges",
        duration: "10 minutes",
        sets: "3"
      },
      {
        name: "Cool Down",
        description: "Gentle stretching and relaxation exercises",
        duration: "10 minutes"
      }
    ],
    meals: {
      breakfast: {
        name: `${season.charAt(0).toUpperCase() + season.slice(1)} Energy Bowl`,
        description: `A nutritious breakfast bowl featuring seasonal ingredients for ${season}`,
        calories: 400,
        ingredients: [
          "1 cup seasonal fruits",
          "1/2 cup Greek yogurt",
          "1/4 cup granola",
          "1 tbsp honey",
          "1 tbsp chia seeds"
        ],
        instructions: [
          "Layer yogurt in a bowl",
          "Top with seasonal fruits",
          "Sprinkle granola and chia seeds",
          "Drizzle with honey and serve"
        ]
      },
      lunch: {
        name: `${season.charAt(0).toUpperCase() + season.slice(1)} Vegetable Wrap`,
        description: `A fresh and healthy wrap with seasonal vegetables`,
        calories: 450,
        ingredients: [
          "1 whole grain tortilla",
          "1 cup mixed seasonal vegetables",
          "2 oz grilled chicken or tofu",
          "1/4 cup hummus",
          "Fresh herbs and spices"
        ],
        instructions: [
          "Warm the tortilla slightly",
          "Spread hummus on the tortilla",
          "Layer vegetables and protein",
          "Roll tightly and serve"
        ]
      },
      dinner: {
        name: `${season.charAt(0).toUpperCase() + season.slice(1)} Grain Bowl`,
        description: `A hearty dinner bowl with seasonal grains and vegetables`,
        calories: 550,
        ingredients: [
          "1 cup quinoa or brown rice",
          "1 cup seasonal vegetables",
          "3 oz lean protein",
          "2 tbsp olive oil",
          "Herbs and seasonings"
        ],
        instructions: [
          "Cook grains according to package instructions",
          "Steam or roast seasonal vegetables",
          "Grill or bake protein",
          "Combine in a bowl and season to taste"
        ]
      }
    }
  };
}

// Run the script
generateMonthlyPlans();
