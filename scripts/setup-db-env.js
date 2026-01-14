#!/usr/bin/env node

/**
 * This script ensures DATABASE_URL is set before Prisma commands run.
 * It maps POSTGRES_URL or PRISMA_DATABASE_URL to DATABASE_URL if needed.
 */

// Map POSTGRES_URL or PRISMA_DATABASE_URL to DATABASE_URL if not already set
if (!process.env.DATABASE_URL) {
  if (process.env.POSTGRES_URL) {
    process.env.DATABASE_URL = process.env.POSTGRES_URL;
    console.log('✓ Mapped POSTGRES_URL to DATABASE_URL');
  } else if (process.env.PRISMA_DATABASE_URL) {
    process.env.DATABASE_URL = process.env.PRISMA_DATABASE_URL;
    console.log('✓ Mapped PRISMA_DATABASE_URL to DATABASE_URL');
  } else {
    console.warn('⚠ Warning: DATABASE_URL, POSTGRES_URL, or PRISMA_DATABASE_URL must be set');
  }
}

// Export the command to run (everything after this script name)
const command = process.argv.slice(2).join(' ');

if (command) {
  // Execute the command with the updated environment
  const { execSync } = require('child_process');
  execSync(command, { stdio: 'inherit', env: process.env });
}

