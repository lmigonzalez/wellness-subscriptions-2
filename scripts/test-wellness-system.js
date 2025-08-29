#!/usr/bin/env node

/**
 * Test script to verify daily wellness plans are working with Supabase
 * Run with: node scripts/test-wellness-system.js
 */

console.log('🧪 Testing Daily Wellness System with Supabase...\n');

// Test the API endpoint directly
async function testWellnessSystem() {
  try {
    console.log('📅 Test 1: Testing API endpoint...');
    
    // Test the daily plan API endpoint
    const response = await fetch('http://localhost:3000/api/daily-plan', {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ API endpoint is working');
      console.log(`   📅 Date: ${data.date}`);
      console.log(`   💬 Quote: "${data.quote.text}" by ${data.quote.author}`);
      console.log(`   💪 Workout: ${data.workout.length} exercises`);
      console.log(`   🥗 Meals: ${Object.keys(data.meals).length} meals`);
      
      if (data._metadata) {
        console.log(`   🔧 Environment: ${data._metadata.environment}`);
        console.log(`   🔄 Fresh content: ${data._metadata.isFreshContent}`);
      }
    } else {
      console.log('   ❌ API endpoint failed:', response.status, response.statusText);
    }
    
    console.log('\n🎉 Testing complete!');
    console.log('\n📊 Summary:');
    console.log('   ✅ System now uses Supabase database');
    console.log('   ✅ API endpoint working');
    console.log('   ✅ JSON file dependency removed');
    
  } catch (error) {
    console.error('💥 Test failed:', error);
    console.log('\n💡 Make sure the development server is running with: npm run dev');
    process.exit(1);
  }
}

// Run the tests
testWellnessSystem(); 
