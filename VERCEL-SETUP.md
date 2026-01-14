# 🚀 Vercel Deployment Guide

This guide walks you through deploying your wellness subscription app to Vercel with PostgreSQL.

## Prerequisites

- A Vercel account
- Vercel CLI installed (`npm i -g vercel`)
- Your project connected to a Git repository

## Step-by-Step Setup

### Step 1: Connect Your Project to Vercel

If you haven't already, connect your local project to a Vercel project:

```bash
vercel link
```

This will:
- Ask you to select or create a Vercel project
- Link your local project to the Vercel project
- Create a `.vercel` directory with project configuration

### Step 2: Set Up Vercel Postgres Database

1. **Create the Database:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your project
   - Go to the **Storage** tab
   - Click **Create Database** → Select **Postgres**
   - Choose a name for your database
   - Select a region close to your users
   - Click **Create**

2. **Vercel automatically creates these environment variables:**
   - `POSTGRES_URL` - Direct connection string
   - `POSTGRES_PRISMA_URL` - Prisma-optimized connection string
   - `POSTGRES_URL_NON_POOLING` - Non-pooling connection string (for migrations)

### Step 3: Pull Environment Variables Locally

Pull the database URL from Vercel to your local environment:

```bash
vercel env pull .env.local
```

This will:
- Create/update `.env.local` with environment variables from Vercel
- Include `POSTGRES_URL` and other variables
- Allow you to test locally against the Vercel database

**Note:** The code automatically maps `POSTGRES_URL` to `DATABASE_URL` if `DATABASE_URL` is not set, so Prisma will work correctly.

### Step 4: Run Database Migrations

Create the database schema in your Vercel Postgres instance:

```bash
npx prisma migrate dev --name init
```

This will:
- Create a migration file locally
- Apply it to your Vercel Postgres database
- Generate the Prisma Client

**Important:** If you already have migrations, use:

```bash
npx prisma migrate deploy
```

This applies existing migrations without creating new ones.

### Step 5: Set Up Other Environment Variables

Make sure all required environment variables are set in Vercel:

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add the following variables for **Production**, **Preview**, and **Development**:

   ```
   OPENAI_API_KEY=your_openai_api_key
   RESEND_API_KEY=your_resend_api_key
   CRON_SECRET=your_cron_secret
   USER_EMAILS=user1@example.com,user2@example.com
   ```

3. **Database URL:** Vercel Postgres automatically provides `POSTGRES_URL`, which the code will use. You can optionally set `DATABASE_URL` to the same value, but it's not required.

### Step 6: Deploy to Vercel

Deploy your application:

```bash
vercel deploy
```

Or push to your connected Git branch:

```bash
git add .
git commit -m "Deploy to Vercel with PostgreSQL"
git push
```

Vercel will automatically:
1. Install dependencies (including `@prisma/client`)
2. Run `postinstall` script (generates Prisma Client)
3. Run `build` script (generates Prisma Client, runs migrations, builds Next.js)
4. Deploy your application

## Build Process

The build process (defined in `package.json`) runs:

```bash
prisma generate && prisma migrate deploy && next build --turbopack
```

This ensures:
- Prisma Client is generated
- Database migrations are applied
- Next.js app is built

## Environment Variables Reference

### Automatically Provided by Vercel Postgres:
- `POSTGRES_URL` - Main connection string (automatically mapped to DATABASE_URL)
- `POSTGRES_PRISMA_URL` - Prisma-optimized connection string
- `POSTGRES_URL_NON_POOLING` - For migrations

### Required by Your App:
- `OPENAI_API_KEY` - Your OpenAI API key
- `RESEND_API_KEY` - Your Resend API key for emails
- `CRON_SECRET` - Secret for securing cron jobs
- `USER_EMAILS` - Comma-separated list of user emails

## Troubleshooting

### Build Fails with "DATABASE_URL not found"

The code automatically maps `POSTGRES_URL` to `DATABASE_URL`. If you still see this error:

1. Check that Vercel Postgres is set up correctly
2. Verify `POSTGRES_URL` exists in Vercel environment variables
3. Make sure you're using the latest code that includes the mapping logic

### Migration Fails

If migrations fail during build:

1. Run migrations manually: `npx prisma migrate deploy`
2. Check that `POSTGRES_URL` or `DATABASE_URL` is set correctly
3. Verify database permissions

### "Prisma Client not generated"

The `postinstall` script should generate it automatically. If not:

1. Check that `@prisma/client` is in `dependencies` (not `devDependencies`)
2. Verify the build logs show `prisma generate` running
3. Manually run: `npx prisma generate`

### Connection Timeout

If you see connection timeouts:

1. Check that your database region matches your Vercel deployment region
2. Verify firewall/network settings
3. Check database is running and accessible

## Next Steps

After deployment:

1. **Test the API:**
   ```bash
   curl https://your-app.vercel.app/api/daily-plan
   ```

2. **Monitor Logs:**
   - Go to Vercel Dashboard → Your Project → **Logs**
   - Check for any errors or warnings

3. **Set Up Cron Job:**
   - The cron job is configured in `vercel.json`
   - It runs daily at 9 AM UTC
   - Make sure `CRON_SECRET` is set for security

4. **View Database:**
   ```bash
   npx prisma studio
   ```
   This opens Prisma Studio to browse your data.

## Local Development with Vercel Database

To use the Vercel database locally:

1. Pull environment variables:
   ```bash
   vercel env pull .env.local
   ```

2. Run migrations (if needed):
   ```bash
   npx prisma migrate dev
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

**Note:** Be careful when running migrations locally against production database. Consider using a separate development database.

## Production Checklist

- [ ] Vercel Postgres database created
- [ ] Environment variables set in Vercel
- [ ] Database migrations applied
- [ ] Build succeeds without errors
- [ ] API endpoints working
- [ ] Cron job configured
- [ ] Email notifications working
- [ ] Database backups configured (if needed)

Your app is now ready for production! 🎉

