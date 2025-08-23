# Daily Wellness Dashboard

A standalone single-page wellness application that displays daily wellness plans including quotes, workouts, and meal plans. The app automatically updates daily at 4:00 AM ET and sends PDF reports via email to registered users.

## Features

- **Premium Access Control**: Only premium users with `?is_premium=true` can access the dashboard
- **Dark-themed Dashboard**: Beautiful, responsive design displaying daily wellness content
- **Daily Auto-Update**: Content refreshes automatically at 4:00 AM ET
- **Email Notifications**: Daily PDF reports sent to all registered users
- **AI-Generated Content**: Fresh quotes, workouts, and meal plans powered by OpenAI
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS
- **Content Generation**: OpenAI GPT-4
- **Data Storage**: JSON files (no database needed!)
- **PDF Generation**: Puppeteer
- **Email Delivery**: Resend
- **Hosting**: Vercel with cron jobs

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key for content generation
- Resend account for email delivery (optional for basic usage)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your values:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   RESEND_API_KEY=your_resend_api_key_here
   CRON_SECRET=your_secure_random_string_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000?is_premium=true](http://localhost:3000?is_premium=true) to view the dashboard

   **Note**: Without the `is_premium=true` parameter, users will see a premium upgrade page.

## Project Structure

```
wellness-subscription-2/
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   └── generate-plan/ # Admin API for manual plan generation
│   │   ├── daily-plan/        # API for fetching daily plans
│   │   └── cron/
│   │       └── daily-plan/    # Cron job for email & PDF generation
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               # Main dashboard page
├── lib/
│   ├── data.ts                # Data structure definitions
│   ├── storage.ts             # JSON file storage system
│   └── openai.ts              # OpenAI integration for content generation
├── data/
│   └── daily-plans.json       # JSON file storing all daily plans
├── vercel.json                # Vercel cron configuration
└── env.example                # Environment variables template
```

## How It Works

### 🤖 **AI-Powered Content Generation**
- Uses OpenAI GPT-4 to generate fresh daily content
- Creates unique quotes, workout plans, and meal plans every day
- Falls back to predefined content if OpenAI is unavailable

### 💾 **Simple JSON Storage**
- No database required - everything stored in `data/daily-plans.json`
- Automatically creates and manages the data file
- Easy to backup, version control, and deploy

### 🔄 **Smart Content Loading**
- Dashboard automatically generates content if none exists for today
- Cron job runs daily at 4:00 AM ET to prepare content and send emails
- Admin API available for manually generating content for specific dates

### 🔒 **Premium Access Control**
- Users must have `?is_premium=true` in the URL to access the dashboard
- Non-premium users see an attractive upgrade page with feature highlights
- Perfect for Shopify integration where premium status is verified

## API Endpoints

- `GET /api/daily-plan` - Fetch today's plan (auto-generates if missing)
- `GET /api/daily-plan?date=YYYY-MM-DD` - Fetch plan for specific date
- `POST /api/cron/daily-plan` - Daily automation (4:00 AM ET)
- `POST /api/admin/generate-plan` - Manually generate plan for specific date
- `GET /api/admin/generate-plan?date=YYYY-MM-DD` - Check if plan exists

## Deployment on Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `OPENAI_API_KEY`
   - `RESEND_API_KEY`
   - `CRON_SECRET`
4. Deploy!

The cron job will automatically run daily at 4:00 AM ET (9:00 AM UTC) as configured in `vercel.json`.

## Shopify Integration

To integrate with your Shopify store:

1. **Create a Premium Product/Subscription** in your Shopify store
2. **Add a Custom Link** on your Shopify pages that directs premium customers to:
   ```
   https://your-wellness-app.vercel.app?is_premium=true
   ```
3. **Use Shopify's Customer Tags** or subscription status to conditionally show the link
4. **Example Shopify Liquid Code**:
   ```liquid
   {% if customer.tags contains 'premium' or customer.has_subscription %}
     <a href="https://your-wellness-app.vercel.app?is_premium=true" 
        class="btn btn-primary">
       Access Your Daily Wellness Dashboard
     </a>
   {% else %}
     <a href="/pages/premium-upgrade" class="btn btn-secondary">
       Upgrade to Premium
     </a>
   {% endif %}
   ```

This ensures only verified premium customers can access the wellness content.

## Email Configuration

To set up email delivery:

1. Sign up for [Resend](https://resend.com)
2. Add your domain and verify it
3. Generate an API key
4. Update the `from` address in the cron job to use your verified domain
5. Add user email addresses to the `userEmails` array in the cron job

## Content Management

### ✨ **Automatic Generation**
The system automatically generates fresh content using OpenAI when no plan exists for the current day.

### 🛠️ **Manual Generation**
You can manually generate content for specific dates using the admin API:

```bash
# Generate plan for a specific date
curl -X POST http://localhost:3000/api/admin/generate-plan \
  -H "Content-Type: application/json" \
  -d '{"date": "2024-12-15"}'

# Check if plan exists
curl "http://localhost:3000/api/admin/generate-plan?date=2024-12-15"
```

### 📁 **JSON Storage**
All plans are stored in `data/daily-plans.json`. You can:
- Back up this file to preserve your content
- Edit plans manually if needed
- Version control your wellness content
- Easily migrate between environments

## Customization

- **Colors**: Modify the Tailwind classes in `app/page.tsx`
- **AI Prompts**: Customize the OpenAI prompts in `lib/openai.ts`
- **Email Template**: Customize the HTML in the cron job function
- **PDF Layout**: Modify the PDF generation HTML in the cron job
- **Fallback Content**: Update the fallback plans in `lib/openai.ts`

## Testing the Cron Job

You can test the email/PDF generation locally:

```bash
# Make a POST request to the cron endpoint
curl -X POST http://localhost:3000/api/cron/daily-plan \
  -H "Authorization: Bearer your_cron_secret_here"
```

## License

This project is built for wellness and health promotion. Feel free to use and modify as needed.
