import { NextRequest, NextResponse } from 'next/server';
import { getTodaysPlan, savePlan } from '@/lib/storage';
import { generateDailyPlan } from '@/lib/openai';
import { DailyPlan } from '@/lib/data';
import puppeteer from 'puppeteer';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Sample user email list - in production, this would come from a database
const userEmails = [
  'user@example.com', // Replace with actual email addresses
];

async function generatePDF(plan: DailyPlan) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Create HTML content that matches the dashboard design
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Daily Wellness Plan</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; }
            @media print { 
              .page-break { page-break-before: always; }
              body { print-color-adjust: exact; }
            }
          </style>
        </head>
        <body class="bg-gray-900 text-white p-8">
          <div class="max-w-4xl mx-auto">
            <!-- Header -->
            <header class="text-center mb-8">
              <h1 class="text-4xl font-bold text-emerald-400 mb-2">Daily Wellness Plan</h1>
              <p class="text-gray-300">${new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </header>

            <!-- Quote of the Day -->
            <section class="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg p-6 text-center mb-8">
              <h2 class="text-2xl font-semibold mb-4">Quote of the Day</h2>
              <blockquote class="text-xl italic mb-4">"${plan.quote.text}"</blockquote>
              <cite class="text-emerald-100">— ${plan.quote.author}</cite>
            </section>

            <!-- Workout Plan -->
            <section class="mb-8">
              <h2 class="text-2xl font-semibold mb-4 text-emerald-400 flex items-center">
                <span class="mr-3">💪</span>
                Today's Workout
              </h2>
              <div class="grid gap-4">
                ${plan.workout.map((exercise) => `
                  <div class="bg-gray-800 rounded-lg p-4">
                    <h3 class="font-semibold text-lg text-white mb-2">${exercise.name}</h3>
                    <p class="text-gray-300 mb-2">${exercise.description}</p>
                    <div class="flex flex-wrap gap-2 text-sm">
                      <span class="bg-emerald-600 px-2 py-1 rounded text-white">${exercise.duration}</span>
                      ${exercise.sets ? `<span class="bg-blue-600 px-2 py-1 rounded text-white">${exercise.sets} sets</span>` : ''}
                      ${exercise.reps ? `<span class="bg-purple-600 px-2 py-1 rounded text-white">${exercise.reps} reps</span>` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </section>

            <div class="page-break"></div>

            <!-- Meal Plan -->
            <section>
              <h2 class="text-2xl font-semibold mb-4 text-emerald-400 flex items-center">
                <span class="mr-3">🥗</span>
                Today's Meals
              </h2>
              
              <!-- Breakfast -->
              <div class="bg-gray-800 rounded-lg p-4 mb-6">
                <h3 class="font-semibold text-lg text-orange-400 mb-2">🌅 Breakfast - ${plan.meals.breakfast.name}</h3>
                <p class="text-gray-300 mb-2">${plan.meals.breakfast.description}</p>
                <p class="text-sm text-emerald-400 mb-3">${plan.meals.breakfast.calories} calories</p>
                
                <div class="mb-3">
                  <h4 class="font-medium text-white mb-1">Ingredients:</h4>
                  <ul class="text-sm text-gray-300 list-disc list-inside">
                    ${plan.meals.breakfast.ingredients.map((ingredient: string) => `<li>${ingredient}</li>`).join('')}
                  </ul>
                </div>
                
                <div>
                  <h4 class="font-medium text-white mb-1">Instructions:</h4>
                  <ol class="text-sm text-gray-300 list-decimal list-inside space-y-1">
                    ${plan.meals.breakfast.instructions.map((instruction: string) => `<li>${instruction}</li>`).join('')}
                  </ol>
                </div>
              </div>

              <!-- Lunch -->
              <div class="bg-gray-800 rounded-lg p-4 mb-6">
                <h3 class="font-semibold text-lg text-yellow-400 mb-2">☀️ Lunch - ${plan.meals.lunch.name}</h3>
                <p class="text-gray-300 mb-2">${plan.meals.lunch.description}</p>
                <p class="text-sm text-emerald-400 mb-3">${plan.meals.lunch.calories} calories</p>
                
                <div class="mb-3">
                  <h4 class="font-medium text-white mb-1">Ingredients:</h4>
                  <ul class="text-sm text-gray-300 list-disc list-inside">
                    ${plan.meals.lunch.ingredients.map((ingredient: string) => `<li>${ingredient}</li>`).join('')}
                  </ul>
                </div>
                
                <div>
                  <h4 class="font-medium text-white mb-1">Instructions:</h4>
                  <ol class="text-sm text-gray-300 list-decimal list-inside space-y-1">
                    ${plan.meals.lunch.instructions.map((instruction: string) => `<li>${instruction}</li>`).join('')}
                  </ol>
                </div>
              </div>

              <!-- Dinner -->
              <div class="bg-gray-800 rounded-lg p-4">
                <h3 class="font-semibold text-lg text-purple-400 mb-2">🌙 Dinner - ${plan.meals.dinner.name}</h3>
                <p class="text-gray-300 mb-2">${plan.meals.dinner.description}</p>
                <p class="text-sm text-emerald-400 mb-3">${plan.meals.dinner.calories} calories</p>
                
                <div class="mb-3">
                  <h4 class="font-medium text-white mb-1">Ingredients:</h4>
                  <ul class="text-sm text-gray-300 list-disc list-inside">
                    ${plan.meals.dinner.ingredients.map((ingredient: string) => `<li>${ingredient}</li>`).join('')}
                  </ul>
                </div>
                
                <div>
                  <h4 class="font-medium text-white mb-1">Instructions:</h4>
                  <ol class="text-sm text-gray-300 list-decimal list-inside space-y-1">
                    ${plan.meals.dinner.instructions.map((instruction: string) => `<li>${instruction}</li>`).join('')}
                  </ol>
                </div>
              </div>
            </section>
          </div>
        </body>
      </html>
    `;

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}

async function sendDailyEmail(plan: DailyPlan, pdfBuffer: Buffer) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const emailHtml = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background-color: #111827; color: white; padding: 20px; border-radius: 8px;">
      <header style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #10b981; font-size: 2rem; margin-bottom: 10px;">Daily Wellness Plan</h1>
        <p style="color: #d1d5db; margin: 0;">${today}</p>
      </header>

      <div style="background: linear-gradient(to right, #059669, #0d9488); padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
        <h2 style="margin-bottom: 15px;">Quote of the Day</h2>
        <blockquote style="font-style: italic; font-size: 1.1rem; margin-bottom: 15px;">"${plan.quote.text}"</blockquote>
        <cite style="color: #a7f3d0;">— ${plan.quote.author}</cite>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #10b981; margin-bottom: 15px;">💪 Today's Workout</h2>
        <p style="color: #d1d5db; margin-bottom: 15px;">Your workout includes ${plan.workout.length} exercises designed to keep you active and healthy.</p>
        <ul style="color: #d1d5db; list-style: none; padding: 0;">
          ${plan.workout.slice(0, 3).map((exercise) => `
            <li style="margin-bottom: 8px;">• ${exercise.name} - ${exercise.duration}</li>
          `).join('')}
          ${plan.workout.length > 3 ? `<li style="color: #10b981;">...and ${plan.workout.length - 3} more exercises</li>` : ''}
        </ul>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #10b981; margin-bottom: 15px;">🥗 Today's Meals</h2>
        <div style="color: #d1d5db;">
          <p><strong style="color: #fb923c;">🌅 Breakfast:</strong> ${plan.meals.breakfast.name} (${plan.meals.breakfast.calories} cal)</p>
          <p><strong style="color: #fbbf24;">☀️ Lunch:</strong> ${plan.meals.lunch.name} (${plan.meals.lunch.calories} cal)</p>
          <p><strong style="color: #a855f7;">🌙 Dinner:</strong> ${plan.meals.dinner.name} (${plan.meals.dinner.calories} cal)</p>
        </div>
      </div>

      <div style="text-align: center; padding: 20px; background-color: #1f2937; border-radius: 8px;">
        <p style="color: #d1d5db; margin: 0;">Complete details and instructions are in the attached PDF and on your dashboard.</p>
        <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 0.9rem;">Your daily wellness journey starts here.</p>
      </div>
    </div>
  `;

  // Send emails to all users
  const emailPromises = userEmails.map(email => 
    resend.emails.send({
      from: 'Daily Wellness <noreply@yourdomain.com>', // Replace with your verified domain
      to: email,
      subject: `Your Daily Wellness Plan - ${today}`,
      html: emailHtml,
      attachments: [
        {
          filename: `wellness-plan-${new Date().toISOString().split('T')[0]}.pdf`,
          content: pdfBuffer,
        },
      ],
    })
  );

  const results = await Promise.allSettled(emailPromises);
  return results;
}

export async function POST(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request (in production, you'd verify the cron secret)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date().toISOString().split('T')[0];
    
    // Generate new plan for today if it doesn't exist
    let plan = await getTodaysPlan();
    if (!plan) {
      console.log('Generating new daily plan with OpenAI...');
      plan = await generateDailyPlan(today);
      
      // Only try to save in development (production can't write to filesystem)
      if (process.env.NODE_ENV !== 'production') {
        await savePlan(plan);
        console.log('Generated and saved new plan for today');
      } else {
        console.log('Generated new plan for today (production - no file save)');
      }
    } else {
      console.log('Using existing plan for today');
    }

    // Generate PDF
    console.log('Generating PDF...');
    const pdfBuffer = await generatePDF(plan);

    // Send emails with PDF attachment
    console.log('Sending emails...');
    const emailResults = await sendDailyEmail(plan, pdfBuffer);

    const successCount = emailResults.filter(result => result.status === 'fulfilled').length;
    const failureCount = emailResults.filter(result => result.status === 'rejected').length;

    console.log(`Email sending complete: ${successCount} successful, ${failureCount} failed`);

    return NextResponse.json({
      success: true,
      message: 'Daily plan processing complete',
      emailsSent: successCount,
      emailsFailed: failureCount,
      planDate: plan.date
    });

  } catch (error) {
    console.error('Error in daily plan cron job:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Also allow GET for testing purposes
export async function GET() {
  return NextResponse.json({
    message: 'Daily plan cron endpoint is working. Use POST to trigger the daily email.',
    time: new Date().toISOString()
  });
}
