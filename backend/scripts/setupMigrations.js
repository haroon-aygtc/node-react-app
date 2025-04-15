/**
 * Script to set up Prisma migrations
 * 
 * This script:
 * 1. Generates Prisma client
 * 2. Creates initial migration
 * 3. Applies migrations to the database
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Check if .env file exists, if not copy from .env.development
const envPath = path.join(rootDir, '.env');
const envDevPath = path.join(rootDir, '.env.development');

if (!fs.existsSync(envPath) && fs.existsSync(envDevPath)) {
  console.log('Creating .env file from .env.development...');
  fs.copyFileSync(envDevPath, envPath);
}

try {
  // Generate Prisma client
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit', cwd: rootDir });
  
  // Create initial migration if it doesn't exist
  const migrationsDir = path.join(rootDir, 'prisma/migrations');
  if (!fs.existsSync(migrationsDir) || fs.readdirSync(migrationsDir).length === 0) {
    console.log('Creating initial migration...');
    execSync('npx prisma migrate dev --name init', { stdio: 'inherit', cwd: rootDir });
  } else {
    console.log('Applying existing migrations...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit', cwd: rootDir });
  }
  
  console.log('Database migrations setup complete!');
} catch (error) {
  console.error('Error setting up migrations:', error.message);
  process.exit(1);
}
