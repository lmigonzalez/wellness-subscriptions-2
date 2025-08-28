# Wellness Subscription App

A Next.js application that generates personalized daily wellness plans with workouts, meal plans, and inspirational quotes.

## Features

- **Daily Wellness Plans**: Personalized daily workout routines and meal plans
- **Inspirational Quotes**: Fresh daily quotes generated using OpenAI
- **Daily Plans**: Comprehensive daily workout routines and meal plans
- **PDF Generation**: Beautiful PDF exports of daily plans
- **Email Delivery**: Automated email delivery with PDF attachments
- **Cron Jobs**: Automated daily plan generation and delivery

## Daily Wellness Plans

### How It Works

1. **Daily Quotes**: Each day, a fresh inspirational quote is generated using OpenAI's GPT-4 model
2. **Daily Workouts**: Fresh daily workout routines with 7 varied exercises (cardio, strength, flexibility, core)
3. **Daily Meals**: Fresh daily meal plans with 3 nutritious meals (breakfast, lunch, dinner) using seasonal ingredients
4. **Complete Daily Experience**: Each day provides a unique combination of quote, workout, and meals

### Quote Generation

- Quotes are generated fresh each day using OpenAI
- Fallback quotes are available if OpenAI is unavailable
- Quotes are wellness, health, and fitness focused
- Each quote is unique and inspiring for the specific day

### Daily Plan Generation

- Each day generates fresh content for a unique experience
- Workouts include 7 varied exercises (cardio, strength, flexibility, core)
- 3 nutritious meals (breakfast, lunch, dinner) with seasonal ingredients
- Plans consider seasonal availability and weather
- Content is optimized for daily variety and engagement

## Setup

### Environment Variables

Create a `.env.local` file with:

```bash
OPENAI_API_KEY=your_openai_api_key
RESEND_API_KEY=your_resend_api_key
CRON_SECRET=your_cron_secret_key
ADMIN_SECRET=your_admin_secret_key
```

### Installation

```bash
npm install
npm run dev
```

## Usage

### Generate Daily Plans

Generate fresh daily plans for specific dates:

```bash
curl -X POST http://localhost:3000/api/admin/generate-plan \
  -H "Content-Type: application/json" \
  -d '{"date": "2025-01-15"}'
```

### Test System

Test that daily wellness plans are working properly:

```bash
npm run test-wellness
```



### Cron Job

The system includes a cron job that runs daily at 9 AM to:
- Generate fresh daily quotes
- Create daily plans
- Generate PDFs
- Send emails to subscribers

## API Endpoints

- `GET /api/daily-plan` - Get today's plan or plan for specific date
- `POST /api/cron/daily-plan` - Trigger daily plan generation (cron job)
- `POST /api/admin/generate-plan` - Generate daily plan for specific date

## Data Storage

- **Development**: Plans are stored in JSON files in the `data/` directory
- **Production**: Plans are generated fresh each day (no file system access)

## Troubleshooting

### Daily Quotes Not Working

1. Check your OpenAI API key is valid
2. Ensure you have sufficient OpenAI credits
3. Check the console logs for error messages
4. Run `npm run test-wellness` to diagnose issues

### Daily Plans Not Updating

1. Check that the daily plan generation is working properly
2. Verify OpenAI API is responding correctly
3. Check the console logs for error messages

### Cron Job Issues

1. Ensure your Vercel cron job is enabled
2. Check the `CRON_SECRET` environment variable matches
3. Verify the cron schedule in `vercel.json`
4. Check Vercel function logs for errors

## Development

### File Structure

```
lib/
  ├── openai.ts          # OpenAI integration for quotes and plans
  ├── storage.ts         # Daily plan storage utilities
  └── data.ts           # Data types and sample data

scripts/
  └── test-wellness-system.js    # System testing utility

app/api/
  ├── cron/daily-plan/           # Daily cron job endpoint
  ├── admin/generate-plan/       # Admin daily plan generation
  └── daily-plan/                # Daily plan retrieval
```

### Adding New Features

1. **New Quote Categories**: Modify the OpenAI prompt in `generateDailyQuote()`
2. **Additional Exercise Types**: Update the `Exercise` interface in `data.ts`
3. **New Meal Categories**: Extend the `Meal` interface and update generation prompts
4. **Custom Workout Plans**: Modify the daily plan generation in `generateDailyPlan()`

## Production Deployment

### Vercel

1. Deploy to Vercel
2. Set environment variables in Vercel dashboard
3. Enable cron jobs in Vercel functions
4. Verify cron job is running at scheduled time

### Environment Variables

Ensure all required environment variables are set in production:
- `OPENAI_API_KEY`
- `RESEND_API_KEY` 
- `CRON_SECRET`
- `ADMIN_SECRET`

## Support

For issues or questions:
1. Check the console logs for error messages
2. Run the test script: `npm run test-wellness`
3. Verify environment variables are set correctly
4. Check OpenAI API status and credits
