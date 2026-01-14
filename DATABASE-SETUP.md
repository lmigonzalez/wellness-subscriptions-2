# 🗄️ Database Setup Guide

## Database: SQLite with Prisma

This project uses **SQLite** with **Prisma ORM** for database operations. SQLite is perfect for this use case because:

- ✅ **No external dependencies** - Database is a local file
- ✅ **Simple setup** - No cloud service configuration needed
- ✅ **Fast and reliable** - Perfect for single-instance deployments
- ✅ **Production ready** - Works great on Vercel and other platforms
- ✅ **Type-safe** - Prisma provides excellent TypeScript support

## 🚀 Quick Setup (2 minutes)

### Step 1: Install Dependencies

Dependencies are already installed, but if you need to reinstall:

```bash
npm install
```

### Step 2: Set Up Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. The `DATABASE_URL` is already configured for SQLite:
   ```bash
   DATABASE_URL="file:./dev.db"
   ```

### Step 3: Run Database Migrations

The database schema is already set up, but if you need to reset:

```bash
npx prisma migrate dev
```

This will:
- Create the SQLite database file (`dev.db`)
- Apply all migrations
- Generate the Prisma Client

### Step 4: Generate Prisma Client

If the client isn't generated yet:

```bash
npx prisma generate
```

## 🔧 Database Schema

The `daily_plans` table stores:
- **id**: Auto-incrementing primary key
- **date**: YYYY-MM-DD format (unique)
- **quoteText**: Daily motivational quote text
- **quoteAuthor**: Quote author name
- **workout**: JSON string of exercises array
- **meals**: JSON string of meals object (breakfast/lunch/dinner)
- **createdAt**: When plan was created
- **updatedAt**: When plan was last updated

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

## 🚀 Deploy to Production

### Vercel Deployment

1. **Add environment variable to Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add `DATABASE_URL` with value `file:./prisma/dev.db` (or use a different path)

2. **Update Prisma for production:**
   - The database file will be created automatically on first run
   - For persistent storage, consider using Vercel's file system or switch to PostgreSQL

3. **Deploy:**
   ```bash
   git add .
   git commit -m "Switch to SQLite with Prisma"
   git push
   ```

### Alternative: Use PostgreSQL in Production

If you need a more robust database for production, you can switch to PostgreSQL:

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Update `DATABASE_URL` to your PostgreSQL connection string

3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

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

## 🔍 Troubleshooting

### "Prisma Client not generated"
Run `npx prisma generate` to generate the client.

### "Database file not found"
The database file is created automatically on first migration. Run `npx prisma migrate dev`.

### "Migration failed"
Check your `DATABASE_URL` in `.env.local`. For SQLite, it should be `file:./dev.db`.

### "Permission denied"
Make sure the database file and directory are writable.

## 💡 Benefits of SQLite + Prisma

- **No external services** - Everything runs locally
- **Type safety** - Prisma generates TypeScript types
- **Easy migrations** - Schema changes are version controlled
- **Great developer experience** - Prisma Studio for database browsing
- **Fast queries** - SQLite is very fast for read-heavy workloads
- **Simple backups** - Just copy the database file

## 🎯 Next Steps

After setup:
1. Test locally with `npm run dev`
2. Use Prisma Studio to browse your data: `npx prisma studio`
3. Deploy to Vercel
4. Monitor your database file size

The SQLite + Prisma solution provides a simple, reliable database setup! 🎉
