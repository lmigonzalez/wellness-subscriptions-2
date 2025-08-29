# 🗄️ Database Setup Guide

## Why Database Instead of Files?

- ✅ **No caching issues** - Vercel can't cache database queries
- ✅ **Real-time updates** - Fresh content every time
- ✅ **Scalable** - Handles multiple users and plans
- ✅ **Reliable** - No file system dependencies
- ✅ **Production ready** - Works perfectly on Vercel

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" (FREE tier)
3. Sign up with GitHub/Google

### Step 2: Create New Project
1. Click "New Project"
2. Choose organization
3. Enter project name: `wellness-subscription`
4. Enter database password (save this!)
5. Choose region closest to you
6. Click "Create new project"

### Step 3: Get API Keys
1. Go to Settings → API
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 4: Create Database Table
1. Go to SQL Editor in Supabase
2. Copy and paste the contents of `database-schema.sql`
3. Click "Run" to execute

### Step 5: Update Environment Variables
1. Copy `.env.example` to `.env.local`
2. Add your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🔧 Database Schema

The `daily_plans` table stores:
- **date**: YYYY-MM-DD format (unique)
- **quote_text**: Daily motivational quote
- **quote_author**: Quote author
- **workout**: JSON array of exercises
- **meals**: JSON object with breakfast/lunch/dinner
- **created_at**: When plan was created
- **updated_at**: When plan was last updated

## 🧪 Testing

### Test Database Connection
```bash
curl "http://localhost:3000/api/debug"
```

### Test Plan Generation
```bash
curl "http://localhost:3000/api/daily-plan"
```

### Force Fresh Generation
```bash
curl "http://localhost:3000/api/force-refresh"
```

## 🚀 Deploy to Production

1. **Add environment variables to Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **Deploy:**
   ```bash
   git add .
   git commit -m "Add database support for daily plans"
   git push
   ```

3. **Test production:**
   ```bash
   curl "https://your-domain.vercel.app/api/daily-plan"
   ```

## 🔍 Troubleshooting

### "Missing Supabase environment variables"
- Check your `.env.local` file
- Ensure variables are prefixed with `NEXT_PUBLIC_`

### "Table doesn't exist"
- Run the SQL schema in Supabase SQL Editor
- Check table name is exactly `daily_plans`

### "Permission denied"
- Check Row Level Security (RLS) policies in Supabase
- Ensure the "Allow all operations" policy is active

## 💡 Benefits

- **No more caching issues** - Database queries are always fresh
- **Real-time data** - Updates immediately
- **Scalable** - Can handle thousands of users
- **Reliable** - No file system dependencies
- **Production ready** - Works perfectly on Vercel

## 🎯 Next Steps

After setup:
1. Test locally with `npm run dev`
2. Deploy to Vercel
3. Test production endpoint
4. Monitor Supabase dashboard for usage

The database solution will completely eliminate the Vercel caching issues! 🎉
