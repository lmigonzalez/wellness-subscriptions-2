-- ⚠️ DEPRECATED: This file is no longer used
-- The project now uses Prisma with SQLite
-- See prisma/schema.prisma for the current schema definition
-- This file is kept for reference only

-- Daily Plans Database Schema (PostgreSQL/Supabase version)
-- This was the original schema when using Supabase

-- Create the daily_plans table
CREATE TABLE IF NOT EXISTS daily_plans (
  id SERIAL PRIMARY KEY,
  date VARCHAR(10) UNIQUE NOT NULL, -- YYYY-MM-DD format
  quote_text TEXT NOT NULL,
  quote_author VARCHAR(255) NOT NULL,
  workout JSONB NOT NULL,
  meals JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on date for fast lookups
CREATE INDEX IF NOT EXISTS idx_daily_plans_date ON daily_plans(date);

-- Create index on created_at for cleanup operations
CREATE INDEX IF NOT EXISTS idx_daily_plans_created_at ON daily_plans(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE daily_plans ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can restrict this later)
CREATE POLICY "Allow all operations" ON daily_plans
  FOR ALL USING (true);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_daily_plans_updated_at
  BEFORE UPDATE ON daily_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
INSERT INTO daily_plans (date, quote_text, quote_author, workout, meals) VALUES
('2025-08-29', 'The groundwork of all happiness is health.', 'Leigh Hunt', 
 '[]', '{}')
ON CONFLICT (date) DO NOTHING;
