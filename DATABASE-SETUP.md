# 🗄️ Database Setup Guide

## Database: PostgreSQL with Prisma

This project uses **PostgreSQL** with **Prisma ORM** for database operations. PostgreSQL is required for Vercel deployments because:

- ✅ **Serverless compatible** - Works perfectly with Vercel's serverless functions
- ✅ **Persistent storage** - Data persists across function invocations
- ✅ **Scalable** - Can handle production workloads
- ✅ **Type-safe** - Prisma provides excellent TypeScript support
- ✅ **Production ready** - Industry standard for production applications

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Dependencies

Dependencies are already installed, but if you need to reinstall:

```bash
npm install
```

### Step 2: Set Up Database

#### Option A: Vercel Postgres (Recommended for Production)

1. **Create Vercel Postgres Database:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your project → **Storage** tab
   - Click **Create Database** → Select **Postgres**
   - Choose a name for your database
   - Select a region close to your users
   - Click **Create**

2. **Get Connection String:**
   - After creation, go to **Settings** → **Environment Variables**
   - Vercel automatically creates `POSTGRES_URL` (or `DATABASE_URL`)
   - Copy the connection string

3. **Add to Environment Variables:**
   - In Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add `DATABASE_URL` with the connection string from step 2
   - Make sure to add it for **Production**, **Preview**, and **Development** environments

#### Option B: Local PostgreSQL (For Development)

1. **Install PostgreSQL locally:**
   ```bash
   # macOS (using Homebrew)
   brew install postgresql@15
   brew services start postgresql@15
   
   # Or use Docker
   docker run --name wellness-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=wellness_db -p 5432:5432 -d postgres:15
   ```

2. **Create Database:**
   ```bash
   createdb wellness_db
   # Or with Docker, it's already created
   ```

3. **Set Environment Variable:**
   Create `.env.local` file:
   ```bash
   DATABASE_URL="postgresql://postgres:password@localhost:5432/wellness_db?schema=public"
   ```
   
   Replace `postgres`, `password`, and `wellness_db` with your actual credentials.

#### Option C: Other PostgreSQL Providers

You can also use:
- **Supabase** (Free tier available): https://supabase.com
- **Neon** (Serverless Postgres): https://neon.tech
- **Railway**: https://railway.app
- **Render**: https://render.com

Just get the connection string and add it to your `DATABASE_URL` environment variable.

### Step 3: Run Database Migrations

After setting up your database, run migrations:

```bash
# For local development
npx prisma migrate dev

# For production (Vercel)
npx prisma migrate deploy
```

This will:
- Create the `daily_plans` table
- Apply all migrations
- Generate the Prisma Client

### Step 4: Generate Prisma Client

If the client isn't generated yet:

```bash
npx prisma generate
```

## 🔧 Database Schema

The `daily_plans` table stores:
- **id**: Auto-incrementing primary key (SERIAL)
- **date**: YYYY-MM-DD format (unique, TEXT)
- **quote_text**: Daily motivational quote text (TEXT)
- **quote_author**: Quote author name (TEXT)
- **workout**: JSON string of exercises array (TEXT)
- **meals**: JSON string of meals object (breakfast/lunch/dinner) (TEXT)
- **created_at**: When plan was created (TIMESTAMP)
- **updated_at**: When plan was last updated (TIMESTAMP)

## 🧪 Testing

### Test Database Connection
```bash
curl "http://localhost:3000/api/test-db"
```

### Test Plan Generation
```bash
curl "http://localhost:3000/api/daily-plan"
```

### Force Fresh Generation
```bash
curl "http://localhost:3000/api/force-refresh"
```

### Clear Today's Plan
```bash
curl -X POST "http://localhost:3000/api/clear-today"
```

## 🚀 Deploy to Vercel

### Step 1: Set Up Vercel Postgres

1. Go to Vercel Dashboard → Your Project → **Storage** tab
2. Click **Create Database** → Select **Postgres**
3. Choose a name and region
4. Click **Create**

### Step 2: Add Environment Variables

Vercel will automatically add `POSTGRES_URL` or `DATABASE_URL`. If you need to add it manually:

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add `DATABASE_URL` with your PostgreSQL connection string
3. Make sure it's added for **Production**, **Preview**, and **Development**

### Step 3: Run Migrations on Vercel

Add a build script to run migrations automatically. Update `package.json`:

```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build",
    "postinstall": "prisma generate"
  }
}
```

Or use Vercel's build command:
```bash
prisma generate && prisma migrate deploy && next build
```

### Step 4: Deploy

```bash
git add .
git commit -m "Migrate to PostgreSQL for Vercel compatibility"
git push
```

Vercel will automatically:
1. Install dependencies
2. Generate Prisma Client
3. Run migrations
4. Build your application

## 🔍 Prisma Commands

### View Database in Prisma Studio
```bash
npx prisma studio
```
Opens a visual database browser at `http://localhost:5555`

### Create a New Migration
```bash
npx prisma migrate dev --name migration_name
```

### Reset Database (⚠️ Deletes all data)
```bash
npx prisma migrate reset
```

### Generate Prisma Client
```bash
npx prisma generate
```

### Deploy Migrations (Production)
```bash
npx prisma migrate deploy
```

## 🔍 Troubleshooting

### "Prisma Client not generated"
Run `npx prisma generate` to generate the client.

### "Database connection failed"
- Check your `DATABASE_URL` environment variable
- Verify your PostgreSQL database is running
- Check firewall/network settings
- For Vercel, ensure the connection string is correct in environment variables

### "Migration failed"
- Check your `DATABASE_URL` in `.env.local` or Vercel environment variables
- Ensure the database exists and is accessible
- Check database user permissions

### "Relation does not exist" (on Vercel)
- Run migrations: `npx prisma migrate deploy`
- Ensure migrations run during build (add to build script)

### Build Error on Vercel
- Make sure `DATABASE_URL` is set in Vercel environment variables
- Add `prisma generate` to your build command
- Ensure `@prisma/client` is in dependencies (not devDependencies)

## 💡 Why PostgreSQL Instead of SQLite?

- **Vercel Compatibility**: SQLite requires a writable filesystem, which Vercel's serverless functions don't provide
- **Persistence**: Data persists across function invocations
- **Scalability**: PostgreSQL can handle production workloads
- **Multi-instance**: Works with multiple serverless function instances
- **Industry Standard**: PostgreSQL is the standard for production applications

## 🎯 Next Steps

After setup:
1. Test locally with `npm run dev`
2. Use Prisma Studio to browse your data: `npx prisma studio`
3. Deploy to Vercel with Vercel Postgres
4. Monitor your database usage in Vercel Dashboard

The PostgreSQL + Prisma solution provides a robust, production-ready database setup! 🎉
