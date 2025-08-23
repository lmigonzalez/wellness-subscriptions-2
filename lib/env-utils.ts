// Environment utility functions
export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';

// Check if we're running on Vercel
export const isVercel = process.env.VERCEL === '1';

// Check if we can write to filesystem
export const canWriteToFilesystem = !isProduction && !isVercel;
